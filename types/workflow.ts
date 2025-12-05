// Core workflow types for FlowForge

export type NodeType = "trigger" | "action" | "logic" | "transform" | "integration" | "custom"

export type NodeCategory =
  | "triggers"
  | "actions"
  | "flow-control"
  | "data"
  | "integrations"
  | "ai"
  | "communication"
  | "utilities"

export interface NodeInput {
  id: string
  name: string
  type: "string" | "number" | "boolean" | "object" | "array" | "any"
  required: boolean
  default?: unknown
  description?: string
}

export interface NodeOutput {
  id: string
  name: string
  type: "string" | "number" | "boolean" | "object" | "array" | "any"
  description?: string
}

export interface NodeParameter {
  id: string
  name: string
  displayName: string
  type: "string" | "number" | "boolean" | "select" | "multiselect" | "code" | "json" | "credential"
  required: boolean
  default?: unknown
  options?: { label: string; value: string }[]
  placeholder?: string
  description?: string
  dependsOn?: string
  showWhen?: { field: string; value: unknown }
}

export interface NodeDefinition {
  id: string
  name: string
  displayName: string
  description: string
  icon: string
  category: NodeCategory
  type: NodeType
  version: string
  author?: string
  inputs: NodeInput[]
  outputs: NodeOutput[]
  parameters: NodeParameter[]
  credentialType?: string
  documentation?: string
  tags?: string[]
}

export interface WorkflowNode {
  id: string
  definitionId: string
  position: { x: number; y: number }
  data: {
    label: string
    parameters: Record<string, unknown>
    credentials?: string
  }
  selected?: boolean
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

export interface Workflow {
  id: string
  name: string
  description?: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  settings: WorkflowSettings
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  folderId?: string
  tags?: string[]
}

export interface WorkflowSettings {
  timezone: string
  errorWorkflow?: string
  saveExecutions: "all" | "errors" | "none"
  executionTimeout: number
  maxRetries: number
}

export type ExecutionStatus = "pending" | "running" | "success" | "error" | "cancelled" | "waiting"

export interface NodeExecution {
  nodeId: string
  status: ExecutionStatus
  startedAt?: Date
  finishedAt?: Date
  duration?: number
  input?: unknown
  output?: unknown
  error?: string
  retryCount: number
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  workflowName: string
  status: ExecutionStatus
  mode: "manual" | "trigger" | "webhook" | "scheduled"
  startedAt: Date
  finishedAt?: Date
  duration?: number
  nodeExecutions: NodeExecution[]
  error?: string
  triggeredBy?: string
}

export interface Credential {
  id: string
  name: string
  type: string
  data: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: "admin" | "editor" | "viewer"
  createdAt: Date
}

export interface Workspace {
  id: string
  name: string
  description?: string
  ownerId: string
  members: { userId: string; role: "admin" | "editor" | "viewer" }[]
  createdAt: Date
}

export interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  createdAt: Date
  lastUsedAt?: Date
  expiresAt?: Date
}

export interface MarketplaceNode extends NodeDefinition {
  downloads: number
  rating: number
  reviews: number
  publishedAt: Date
  isInstalled?: boolean
  isPremium?: boolean
}
