import type { Workflow, WorkflowNode, WorkflowEdge, WorkflowExecution, NodeExecution } from "@/types/workflow"
import { nodeRegistry } from "@/lib/nodes/node-registry"

interface ExecutionContext {
  workflowId: string
  executionId: string
  variables: Record<string, unknown>
  nodeOutputs: Map<string, unknown>
}

type NodeExecutor = (node: WorkflowNode, input: unknown, context: ExecutionContext) => Promise<unknown>

// Node executors
const nodeExecutors: Record<string, NodeExecutor> = {
  "webhook-trigger": async (node) => {
    // Webhook data comes from external source
    return node.data.parameters.webhookData || {}
  },

  "cron-trigger": async () => {
    return { timestamp: new Date().toISOString() }
  },

  "manual-trigger": async (node) => {
    return node.data.parameters.testData || {}
  },

  "http-request": async (node) => {
    const { method, url, headers, body } = node.data.parameters as {
      method: string
      url: string
      headers?: Record<string, string>
      body?: unknown
    }

    // Use internal proxy to avoid CORS
    const response = await fetch("/api/proxy/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method,
        url,
        headers,
        body,
      }),
    })

    if (!response.ok) {
        throw new Error(`HTTP Request failed: ${response.statusText}`);
    }

    const result = await response.json()
    return result
  },

  delay: async (node, input) => {
    const duration = (node.data.parameters.duration as number) || 1000
    await new Promise((resolve) => setTimeout(resolve, duration))
    return input
  },

  "if-condition": async (node, input) => {
    const condition = node.data.parameters.condition as string
    try {
      const fn = new Function("data", `return ${condition}`)
      const result = fn(input)
      return { result: !!result, data: input }
    } catch {
      return { result: false, data: input, error: "Invalid condition" }
    }
  },

  switch: async (node, input) => {
    const property = node.data.parameters.property as string
    const cases = node.data.parameters.cases as { value: string; output: string }[]

    const getValue = (obj: unknown, path: string): unknown => {
      return path.split(".").reduce((acc: unknown, part) => {
        if (acc && typeof acc === "object" && part in acc) {
          return (acc as Record<string, unknown>)[part]
        }
        return undefined
      }, obj)
    }

    const value = getValue(input, property)
    const matchedCase = cases.find((c) => c.value === value)

    return {
      matchedOutput: matchedCase?.output || "default",
      data: input,
    }
  },

  merge: async (node, input) => {
    // Merge logic would handle multiple inputs
    return Array.isArray(input) ? input : [input]
  },

  "set-data": async (node, input) => {
    const values = node.data.parameters.values as Record<string, unknown>
    const keepOnlySet = node.data.parameters.keepOnlySet as boolean

    if (keepOnlySet) {
      return values
    }

    return { ...(input as object), ...values }
  },

  code: async (node, input) => {
    const code = node.data.parameters.code as string
    try {
      const fn = new Function("data", code)
      return fn(input)
    } catch (error) {
      throw new Error(`Code execution failed: ${error}`)
    }
  },

  "ai-chat": async (node, input) => {
    const { model, systemPrompt, prompt, temperature } = node.data.parameters as {
      model: string
      systemPrompt?: string
      prompt: string
      temperature?: number
    }

    // Interpolate prompt with input data
    const interpolatedPrompt = prompt.replace(/\{\{(.*?)\}\}/g, (_, path) => {
      const getValue = (obj: unknown, p: string): string => {
        const result = p.split(".").reduce((acc: unknown, part) => {
          if (acc && typeof acc === "object" && part in acc) {
            return (acc as Record<string, unknown>)[part]
          }
          return undefined
        }, obj)
        return String(result ?? "")
      }
      return getValue(input, path.trim())
    })

    const response = await fetch("/api/openrouter/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model,
            prompt: interpolatedPrompt,
            parameters: {
                temperature,
                messages: systemPrompt ? [{role: "system", content: systemPrompt}] : []
            }
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(`AI Request failed: ${err.error || response.statusText}`);
    }

    const result = await response.json();
    return {
        model,
        prompt: interpolatedPrompt,
        response: result.choices?.[0]?.message?.content || "No response",
        raw: result
    };
  },

  "send-email": async (node) => {
    const { to, subject, body } = node.data.parameters as {
      to: string
      subject: string
      body: string
    }
    // Would integrate with email service
    return { sent: true, to, subject, timestamp: new Date().toISOString() }
  },

  "slack-message": async (node) => {
    const { channel, message } = node.data.parameters as {
      channel: string
      message: string
    }
    // Would integrate with Slack API
    return { sent: true, channel, timestamp: new Date().toISOString() }
  },

  "telegram-message": async (node) => {
    const { chatId, message } = node.data.parameters as {
      chatId: string
      message: string
    }
    // Would integrate with Telegram API
    return { sent: true, chatId, timestamp: new Date().toISOString() }
  },

  "google-sheets": async (node) => {
    const { operation, spreadsheetId, range } = node.data.parameters as {
      operation: string
      spreadsheetId: string
      range: string
    }
    // Would integrate with Google Sheets API
    return { operation, spreadsheetId, range, data: [] }
  },
}

export class WorkflowExecutor {
  private workflow: Workflow
  private execution: WorkflowExecution
  private context: ExecutionContext
  private nodeMap: Map<string, WorkflowNode>
  private edgeMap: Map<string, WorkflowEdge[]>
  private onUpdate?: (execution: WorkflowExecution) => void

  constructor(
    workflow: Workflow,
    options?: {
      onUpdate?: (execution: WorkflowExecution) => void
      initialData?: unknown
    },
  ) {
    this.workflow = workflow
    this.onUpdate = options?.onUpdate

    // Create execution record
    this.execution = {
      id: crypto.randomUUID(),
      workflowId: workflow.id,
      workflowName: workflow.name,
      status: "pending",
      mode: "manual",
      startedAt: new Date(),
      nodeExecutions: [],
    }

    // Create context
    this.context = {
      workflowId: workflow.id,
      executionId: this.execution.id,
      variables: {},
      nodeOutputs: new Map(),
    }

    // Build lookup maps
    this.nodeMap = new Map(workflow.nodes.map((n) => [n.id, n]))
    this.edgeMap = new Map()
    workflow.edges.forEach((edge) => {
      const edges = this.edgeMap.get(edge.source) || []
      edges.push(edge)
      this.edgeMap.set(edge.source, edges)
    })
  }

  async execute(): Promise<WorkflowExecution> {
    this.execution.status = "running"
    this.notifyUpdate()

    try {
      // Find trigger nodes (nodes with no incoming edges)
      const incomingEdges = new Set(this.workflow.edges.map((e) => e.target))
      const triggerNodes = this.workflow.nodes.filter((n) => !incomingEdges.has(n.id))

      if (triggerNodes.length === 0) {
        throw new Error("No trigger node found")
      }

      // Execute from each trigger
      for (const trigger of triggerNodes) {
        await this.executeNode(trigger.id, undefined)
      }

      this.execution.status = "success"
      this.execution.finishedAt = new Date()
      this.execution.duration = this.execution.finishedAt.getTime() - this.execution.startedAt.getTime()
    } catch (error) {
      this.execution.status = "error"
      this.execution.error = error instanceof Error ? error.message : "Unknown error"
      this.execution.finishedAt = new Date()
      this.execution.duration = this.execution.finishedAt.getTime() - this.execution.startedAt.getTime()
    }

    this.notifyUpdate()
    return this.execution
  }

  private async executeNode(nodeId: string, input: unknown): Promise<void> {
    const node = this.nodeMap.get(nodeId)
    if (!node) return

    const definition = nodeRegistry.get(node.definitionId)
    if (!definition) {
      throw new Error(`Node definition not found: ${node.definitionId}`)
    }

    // Create node execution record
    const nodeExecution: NodeExecution = {
      nodeId,
      status: "running",
      startedAt: new Date(),
      input,
      retryCount: 0,
    }
    this.execution.nodeExecutions.push(nodeExecution)
    this.notifyUpdate()

    try {
      // Get executor
      const executor = nodeExecutors[node.definitionId]
      if (!executor) {
        throw new Error(`No executor for node type: ${node.definitionId}`)
      }

      // Execute node
      const output = await executor(node, input, this.context)

      // Store output
      this.context.nodeOutputs.set(nodeId, output)

      // Update node execution
      nodeExecution.status = "success"
      nodeExecution.finishedAt = new Date()
      nodeExecution.duration = nodeExecution.finishedAt.getTime() - nodeExecution.startedAt!.getTime()
      nodeExecution.output = output
      this.notifyUpdate()

      // Execute downstream nodes
      const outgoingEdges = this.edgeMap.get(nodeId) || []
      for (const edge of outgoingEdges) {
        // Handle conditional routing for IF node
        if (node.definitionId === "if-condition") {
          const result = (output as { result: boolean }).result
          if ((result && edge.sourceHandle === "true") || (!result && edge.sourceHandle === "false")) {
            await this.executeNode(edge.target, output)
          }
        }
        // Handle switch routing
        else if (node.definitionId === "switch") {
          const matchedOutput = (output as { matchedOutput: string }).matchedOutput
          if (edge.sourceHandle === matchedOutput) {
            await this.executeNode(edge.target, output)
          }
        }
        // Default: execute all downstream nodes
        else {
          await this.executeNode(edge.target, output)
        }
      }
    } catch (error) {
      nodeExecution.status = "error"
      nodeExecution.finishedAt = new Date()
      nodeExecution.duration = nodeExecution.finishedAt.getTime() - nodeExecution.startedAt!.getTime()
      nodeExecution.error = error instanceof Error ? error.message : "Unknown error"
      this.notifyUpdate()

      // Check retry policy
      if (nodeExecution.retryCount < this.workflow.settings.maxRetries) {
        nodeExecution.retryCount++
        nodeExecution.status = "pending"
        await this.executeNode(nodeId, input)
      } else {
        throw error
      }
    }
  }

  private notifyUpdate(): void {
    this.onUpdate?.(structuredClone(this.execution))
  }

  getExecution(): WorkflowExecution {
    return this.execution
  }
}

export async function executeWorkflow(
  workflow: Workflow,
  options?: {
    onUpdate?: (execution: WorkflowExecution) => void
    initialData?: unknown
  },
): Promise<WorkflowExecution> {
  const executor = new WorkflowExecutor(workflow, options)
  return executor.execute()
}
