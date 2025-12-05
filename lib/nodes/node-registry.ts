import type { NodeDefinition, NodeCategory } from "@/types/workflow"

// Node Registry - Central store for all node definitions
class NodeRegistry {
  private nodes: Map<string, NodeDefinition> = new Map()
  private categoryMap: Map<NodeCategory, NodeDefinition[]> = new Map()

  register(node: NodeDefinition): void {
    this.nodes.set(node.id, node)

    const categoryNodes = this.categoryMap.get(node.category) || []
    categoryNodes.push(node)
    this.categoryMap.set(node.category, categoryNodes)
  }

  get(id: string): NodeDefinition | undefined {
    return this.nodes.get(id)
  }

  getAll(): NodeDefinition[] {
    return Array.from(this.nodes.values())
  }

  getByCategory(category: NodeCategory): NodeDefinition[] {
    return this.categoryMap.get(category) || []
  }

  getCategories(): NodeCategory[] {
    return Array.from(this.categoryMap.keys())
  }

  search(query: string): NodeDefinition[] {
    const lowerQuery = query.toLowerCase()
    return this.getAll().filter(
      (node) =>
        node.name.toLowerCase().includes(lowerQuery) ||
        node.displayName.toLowerCase().includes(lowerQuery) ||
        node.description.toLowerCase().includes(lowerQuery) ||
        node.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    )
  }

  unregister(id: string): void {
    const node = this.nodes.get(id)
    if (node) {
      this.nodes.delete(id)
      const categoryNodes = this.categoryMap.get(node.category)
      if (categoryNodes) {
        this.categoryMap.set(
          node.category,
          categoryNodes.filter((n) => n.id !== id),
        )
      }
    }
  }
}

export const nodeRegistry = new NodeRegistry()

// Default nodes
const defaultNodes: NodeDefinition[] = [
  // Triggers
  {
    id: "webhook-trigger",
    name: "webhook",
    displayName: "Webhook",
    description: "Trigger workflow via HTTP webhook",
    icon: "Webhook",
    category: "triggers",
    type: "trigger",
    version: "1.0.0",
    inputs: [],
    outputs: [{ id: "data", name: "Data", type: "object" }],
    parameters: [
      {
        id: "method",
        name: "method",
        displayName: "HTTP Method",
        type: "select",
        required: true,
        default: "POST",
        options: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
          { label: "PUT", value: "PUT" },
          { label: "DELETE", value: "DELETE" },
        ],
      },
      {
        id: "path",
        name: "path",
        displayName: "Path",
        type: "string",
        required: true,
        placeholder: "/my-webhook",
        description: "The webhook path (will be appended to base URL)",
      },
      {
        id: "authentication",
        name: "authentication",
        displayName: "Authentication",
        type: "select",
        required: false,
        default: "none",
        options: [
          { label: "None", value: "none" },
          { label: "Basic Auth", value: "basic" },
          { label: "Header Auth", value: "header" },
        ],
      },
    ],
    tags: ["trigger", "http", "api"],
  },
  {
    id: "cron-trigger",
    name: "cron",
    displayName: "Schedule",
    description: "Trigger workflow on a schedule",
    icon: "Clock",
    category: "triggers",
    type: "trigger",
    version: "1.0.0",
    inputs: [],
    outputs: [{ id: "timestamp", name: "Timestamp", type: "string" }],
    parameters: [
      {
        id: "mode",
        name: "mode",
        displayName: "Mode",
        type: "select",
        required: true,
        default: "interval",
        options: [
          { label: "Every X Minutes", value: "interval" },
          { label: "Cron Expression", value: "cron" },
        ],
      },
      {
        id: "interval",
        name: "interval",
        displayName: "Interval (minutes)",
        type: "number",
        required: false,
        default: 15,
        showWhen: { field: "mode", value: "interval" },
      },
      {
        id: "cronExpression",
        name: "cronExpression",
        displayName: "Cron Expression",
        type: "string",
        required: false,
        placeholder: "0 */15 * * *",
        showWhen: { field: "mode", value: "cron" },
      },
    ],
    tags: ["trigger", "schedule", "cron", "timer"],
  },
  {
    id: "manual-trigger",
    name: "manual",
    displayName: "Manual Trigger",
    description: "Manually trigger workflow execution",
    icon: "Play",
    category: "triggers",
    type: "trigger",
    version: "1.0.0",
    inputs: [],
    outputs: [{ id: "data", name: "Data", type: "object" }],
    parameters: [],
    tags: ["trigger", "manual", "test"],
  },

  // Actions
  {
    id: "http-request",
    name: "httpRequest",
    displayName: "HTTP Request",
    description: "Make HTTP requests to external APIs",
    icon: "Globe",
    category: "actions",
    type: "action",
    version: "1.0.0",
    inputs: [{ id: "data", name: "Data", type: "any", required: false }],
    outputs: [{ id: "response", name: "Response", type: "object" }],
    parameters: [
      {
        id: "method",
        name: "method",
        displayName: "Method",
        type: "select",
        required: true,
        default: "GET",
        options: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
          { label: "PUT", value: "PUT" },
          { label: "PATCH", value: "PATCH" },
          { label: "DELETE", value: "DELETE" },
        ],
      },
      {
        id: "url",
        name: "url",
        displayName: "URL",
        type: "string",
        required: true,
        placeholder: "https://api.example.com/endpoint",
      },
      {
        id: "headers",
        name: "headers",
        displayName: "Headers",
        type: "json",
        required: false,
        default: {},
      },
      {
        id: "body",
        name: "body",
        displayName: "Body",
        type: "json",
        required: false,
      },
      {
        id: "authentication",
        name: "authentication",
        displayName: "Authentication",
        type: "select",
        required: false,
        default: "none",
        options: [
          { label: "None", value: "none" },
          { label: "Bearer Token", value: "bearer" },
          { label: "Basic Auth", value: "basic" },
          { label: "API Key", value: "apiKey" },
        ],
      },
    ],
    tags: ["http", "api", "request", "fetch"],
  },
  {
    id: "delay",
    name: "delay",
    displayName: "Delay",
    description: "Wait for a specified amount of time",
    icon: "Timer",
    category: "utilities",
    type: "action",
    version: "1.0.0",
    inputs: [{ id: "data", name: "Data", type: "any", required: false }],
    outputs: [{ id: "data", name: "Data", type: "any" }],
    parameters: [
      {
        id: "duration",
        name: "duration",
        displayName: "Duration",
        type: "number",
        required: true,
        default: 1000,
        description: "Delay in milliseconds",
      },
    ],
    tags: ["delay", "wait", "timer", "pause"],
  },

  // Flow Control
  {
    id: "if-condition",
    name: "if",
    displayName: "IF",
    description: "Route workflow based on conditions",
    icon: "GitBranch",
    category: "flow-control",
    type: "logic",
    version: "1.0.0",
    inputs: [{ id: "data", name: "Data", type: "any", required: true }],
    outputs: [
      { id: "true", name: "True", type: "any" },
      { id: "false", name: "False", type: "any" },
    ],
    parameters: [
      {
        id: "condition",
        name: "condition",
        displayName: "Condition",
        type: "code",
        required: true,
        placeholder: "data.value > 10",
        description: "JavaScript expression that returns true or false",
      },
    ],
    tags: ["condition", "if", "branch", "logic"],
  },
  {
    id: "switch",
    name: "switch",
    displayName: "Switch",
    description: "Route to multiple branches based on value",
    icon: "GitMerge",
    category: "flow-control",
    type: "logic",
    version: "1.0.0",
    inputs: [{ id: "data", name: "Data", type: "any", required: true }],
    outputs: [
      { id: "case1", name: "Case 1", type: "any" },
      { id: "case2", name: "Case 2", type: "any" },
      { id: "default", name: "Default", type: "any" },
    ],
    parameters: [
      {
        id: "property",
        name: "property",
        displayName: "Property to Check",
        type: "string",
        required: true,
        placeholder: "data.status",
      },
      {
        id: "cases",
        name: "cases",
        displayName: "Cases",
        type: "json",
        required: true,
        default: [
          { value: "case1", output: "case1" },
          { value: "case2", output: "case2" },
        ],
      },
    ],
    tags: ["switch", "case", "routing", "logic"],
  },
  {
    id: "merge",
    name: "merge",
    displayName: "Merge",
    description: "Merge multiple inputs into one",
    icon: "Merge",
    category: "flow-control",
    type: "logic",
    version: "1.0.0",
    inputs: [
      { id: "input1", name: "Input 1", type: "any", required: true },
      { id: "input2", name: "Input 2", type: "any", required: true },
    ],
    outputs: [{ id: "merged", name: "Merged", type: "array" }],
    parameters: [
      {
        id: "mode",
        name: "mode",
        displayName: "Mode",
        type: "select",
        required: true,
        default: "append",
        options: [
          { label: "Append", value: "append" },
          { label: "Merge by Key", value: "mergeByKey" },
          { label: "Wait for All", value: "waitAll" },
        ],
      },
    ],
    tags: ["merge", "combine", "join"],
  },

  // Data
  {
    id: "set-data",
    name: "set",
    displayName: "Set",
    description: "Set or modify data values",
    icon: "Edit",
    category: "data",
    type: "transform",
    version: "1.0.0",
    inputs: [{ id: "data", name: "Data", type: "any", required: false }],
    outputs: [{ id: "data", name: "Data", type: "object" }],
    parameters: [
      {
        id: "values",
        name: "values",
        displayName: "Values to Set",
        type: "json",
        required: true,
        default: {},
        description: "Key-value pairs to set",
      },
      {
        id: "keepOnlySet",
        name: "keepOnlySet",
        displayName: "Keep Only Set Values",
        type: "boolean",
        required: false,
        default: false,
      },
    ],
    tags: ["set", "data", "transform", "modify"],
  },
  {
    id: "code",
    name: "code",
    displayName: "Code",
    description: "Execute custom JavaScript code",
    icon: "Code",
    category: "data",
    type: "transform",
    version: "1.0.0",
    inputs: [{ id: "data", name: "Data", type: "any", required: false }],
    outputs: [{ id: "data", name: "Data", type: "any" }],
    parameters: [
      {
        id: "code",
        name: "code",
        displayName: "JavaScript Code",
        type: "code",
        required: true,
        default: "// Access input data via `data`\n// Return the output\nreturn { ...data, processed: true };",
      },
    ],
    tags: ["code", "javascript", "custom", "transform"],
  },

  // AI
  {
    id: "ai-chat",
    name: "aiChat",
    displayName: "AI Chat",
    description: "Send messages to AI models",
    icon: "Bot",
    category: "ai",
    type: "action",
    version: "1.0.0",
    inputs: [{ id: "data", name: "Data", type: "any", required: false }],
    outputs: [{ id: "response", name: "Response", type: "object" }],
    parameters: [
      {
        id: "model",
        name: "model",
        displayName: "Model",
        type: "select",
        required: true,
        default: "openai/gpt-4o-mini",
        options: [
          { label: "GPT-4o Mini", value: "openai/gpt-4o-mini" },
          { label: "GPT-4o", value: "openai/gpt-4o" },
          { label: "Claude 3.5 Sonnet", value: "anthropic/claude-3.5-sonnet" },
          { label: "Llama 3.1 70B", value: "meta/llama-3.1-70b" },
        ],
      },
      {
        id: "systemPrompt",
        name: "systemPrompt",
        displayName: "System Prompt",
        type: "string",
        required: false,
        placeholder: "You are a helpful assistant...",
      },
      {
        id: "prompt",
        name: "prompt",
        displayName: "Prompt",
        type: "string",
        required: true,
        placeholder: "Enter your prompt or use {{data.field}}",
      },
      {
        id: "temperature",
        name: "temperature",
        displayName: "Temperature",
        type: "number",
        required: false,
        default: 0.7,
      },
    ],
    credentialType: "openai",
    tags: ["ai", "llm", "chat", "gpt", "claude"],
  },

  // Communication
  {
    id: "send-email",
    name: "email",
    displayName: "Send Email",
    description: "Send emails via SMTP",
    icon: "Mail",
    category: "communication",
    type: "action",
    version: "1.0.0",
    inputs: [{ id: "data", name: "Data", type: "any", required: false }],
    outputs: [{ id: "result", name: "Result", type: "object" }],
    parameters: [
      {
        id: "to",
        name: "to",
        displayName: "To",
        type: "string",
        required: true,
        placeholder: "recipient@example.com",
      },
      {
        id: "subject",
        name: "subject",
        displayName: "Subject",
        type: "string",
        required: true,
      },
      {
        id: "body",
        name: "body",
        displayName: "Body",
        type: "string",
        required: true,
      },
      {
        id: "isHtml",
        name: "isHtml",
        displayName: "HTML Email",
        type: "boolean",
        required: false,
        default: false,
      },
    ],
    credentialType: "smtp",
    tags: ["email", "smtp", "send", "notification"],
  },
  {
    id: "slack-message",
    name: "slack",
    displayName: "Slack",
    description: "Send messages to Slack",
    icon: "MessageSquare",
    category: "communication",
    type: "action",
    version: "1.0.0",
    inputs: [{ id: "data", name: "Data", type: "any", required: false }],
    outputs: [{ id: "result", name: "Result", type: "object" }],
    parameters: [
      {
        id: "channel",
        name: "channel",
        displayName: "Channel",
        type: "string",
        required: true,
        placeholder: "#general",
      },
      {
        id: "message",
        name: "message",
        displayName: "Message",
        type: "string",
        required: true,
      },
    ],
    credentialType: "slack",
    tags: ["slack", "message", "notification", "chat"],
  },
  {
    id: "telegram-message",
    name: "telegram",
    displayName: "Telegram",
    description: "Send messages via Telegram",
    icon: "Send",
    category: "communication",
    type: "action",
    version: "1.0.0",
    inputs: [{ id: "data", name: "Data", type: "any", required: false }],
    outputs: [{ id: "result", name: "Result", type: "object" }],
    parameters: [
      {
        id: "chatId",
        name: "chatId",
        displayName: "Chat ID",
        type: "string",
        required: true,
      },
      {
        id: "message",
        name: "message",
        displayName: "Message",
        type: "string",
        required: true,
      },
    ],
    credentialType: "telegram",
    tags: ["telegram", "message", "notification", "chat"],
  },

  // Integrations
  {
    id: "google-sheets",
    name: "googleSheets",
    displayName: "Google Sheets",
    description: "Read/write data to Google Sheets",
    icon: "Sheet",
    category: "integrations",
    type: "integration",
    version: "1.0.0",
    inputs: [{ id: "data", name: "Data", type: "any", required: false }],
    outputs: [{ id: "data", name: "Data", type: "array" }],
    parameters: [
      {
        id: "operation",
        name: "operation",
        displayName: "Operation",
        type: "select",
        required: true,
        default: "read",
        options: [
          { label: "Read", value: "read" },
          { label: "Append", value: "append" },
          { label: "Update", value: "update" },
          { label: "Clear", value: "clear" },
        ],
      },
      {
        id: "spreadsheetId",
        name: "spreadsheetId",
        displayName: "Spreadsheet ID",
        type: "string",
        required: true,
      },
      {
        id: "range",
        name: "range",
        displayName: "Range",
        type: "string",
        required: true,
        placeholder: "Sheet1!A1:D10",
      },
    ],
    credentialType: "googleSheets",
    tags: ["google", "sheets", "spreadsheet", "data"],
  },
]

// Register default nodes
defaultNodes.forEach((node) => nodeRegistry.register(node))

export { defaultNodes }
