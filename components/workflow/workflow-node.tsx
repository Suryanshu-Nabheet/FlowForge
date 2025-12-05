"use client"

import type React from "react"

import { memo, useMemo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { nodeRegistry } from "@/lib/nodes/node-registry"
import { cn } from "@/lib/utils"
import {
  Webhook,
  Clock,
  Play,
  Globe,
  Timer,
  GitBranch,
  GitMerge,
  Merge,
  Edit,
  Code,
  Bot,
  Mail,
  MessageSquare,
  Send,
  Sheet,
  Zap,
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Webhook,
  Clock,
  Play,
  Globe,
  Timer,
  GitBranch,
  GitMerge,
  Merge,
  Edit,
  Code,
  Bot,
  Mail,
  MessageSquare,
  Send,
  Sheet,
}

interface WorkflowNodeData {
  label: string
  definitionId: string
  parameters: Record<string, unknown>
  status?: "idle" | "running" | "success" | "error"
}

const categoryColors: Record<string, { bg: string; border: string; icon: string }> = {
  triggers: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/50",
    icon: "text-emerald-400",
  },
  actions: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/50",
    icon: "text-blue-400",
  },
  "flow-control": {
    bg: "bg-amber-500/10",
    border: "border-amber-500/50",
    icon: "text-amber-400",
  },
  data: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/50",
    icon: "text-purple-400",
  },
  integrations: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/50",
    icon: "text-rose-400",
  },
  ai: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/50",
    icon: "text-cyan-400",
  },
  communication: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/50",
    icon: "text-indigo-400",
  },
  utilities: {
    bg: "bg-gray-500/10",
    border: "border-gray-500/50",
    icon: "text-gray-400",
  },
}

const statusStyles: Record<string, string> = {
  idle: "",
  running: "node-glow-running animate-pulse",
  success: "node-glow-success",
  error: "node-glow-error border-red-500/50",
}

function WorkflowNodeComponent({ data, selected }: NodeProps<WorkflowNodeData>) {
  const definition = useMemo(() => nodeRegistry.get(data.definitionId), [data.definitionId])

  if (!definition) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3">
        <span className="text-sm text-red-400">Unknown Node</span>
      </div>
    )
  }

  const colors = categoryColors[definition.category] || categoryColors.utilities
  const Icon = iconMap[definition.icon] || Zap
  const status = data.status || "idle"

  return (
    <div
      className={cn(
        "min-w-[180px] rounded-lg border-2 transition-all duration-200",
        colors.bg,
        colors.border,
        statusStyles[status],
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
    >
      {/* Input Handles */}
      {definition.inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          className="!h-3 !w-3 !border-2 !border-card !bg-muted-foreground"
          style={{
            top: `${((index + 1) / (definition.inputs.length + 1)) * 100}%`,
          }}
        />
      ))}

      {/* Node Content */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className={cn("rounded-md p-2", colors.bg)}>
          <Icon className={cn("h-5 w-5", colors.icon)} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{data.label || definition.displayName}</span>
          <span className="text-xs text-muted-foreground">{definition.displayName}</span>
        </div>
      </div>

      {/* Status Indicator */}
      {status !== "idle" && (
        <div className="absolute -top-1 -right-1">
          <div
            className={cn(
              "h-3 w-3 rounded-full",
              status === "running" && "bg-blue-500 animate-pulse",
              status === "success" && "bg-green-500",
              status === "error" && "bg-red-500",
            )}
          />
        </div>
      )}

      {/* Output Handles */}
      {definition.outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          className="!h-3 !w-3 !border-2 !border-card !bg-primary"
          style={{
            top: `${((index + 1) / (definition.outputs.length + 1)) * 100}%`,
          }}
        />
      ))}
    </div>
  )
}

export const WorkflowNode = memo(WorkflowNodeComponent)
