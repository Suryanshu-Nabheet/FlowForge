"use client"

import type React from "react"

import { useMemo } from "react"
import { useWorkflowStore } from "@/lib/store/workflow-store"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X, CheckCircle, XCircle, Clock, Loader2, ChevronRight, Timer } from "lucide-react"
import type { ExecutionStatus } from "@/types/workflow"

const statusConfig: Record<
  ExecutionStatus,
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  pending: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
  running: { icon: Loader2, color: "text-blue-400", bg: "bg-blue-500/10" },
  success: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
  error: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
  cancelled: { icon: XCircle, color: "text-amber-400", bg: "bg-amber-500/10" },
  waiting: { icon: Clock, color: "text-purple-400", bg: "bg-purple-500/10" },
}

export function ExecutionLog() {
  const { executions, currentExecution, toggleExecutionLog, setCurrentExecution } = useWorkflowStore()

  const recentExecutions = useMemo(() => executions.slice(0, 20), [executions])

  const formatDuration = (ms?: number) => {
    if (!ms) return "-"
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Execution Log</h3>
          <Badge variant="secondary" className="text-xs">
            {executions.length} runs
          </Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleExecutionLog} className="h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Execution List */}
        <div className="w-80 border-r border-border">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              {recentExecutions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No executions yet</p>
                  <p className="text-xs text-muted-foreground/70">Run your workflow to see results here</p>
                </div>
              ) : (
                recentExecutions.map((execution) => {
                  const config = statusConfig[execution.status]
                  const StatusIcon = config.icon

                  return (
                    <button
                      key={execution.id}
                      onClick={() => setCurrentExecution(execution)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
                        "hover:bg-muted",
                        currentExecution?.id === execution.id && "bg-muted",
                      )}
                    >
                      <div className={cn("rounded-md p-1.5", config.bg)}>
                        <StatusIcon
                          className={cn("h-4 w-4", config.color, execution.status === "running" && "animate-spin")}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{execution.workflowName}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatTime(execution.startedAt)}</span>
                          <span>•</span>
                          <span>{formatDuration(execution.duration)}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Execution Details */}
        <div className="flex-1">
          {currentExecution ? (
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {/* Execution Summary */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{currentExecution.workflowName}</h4>
                    <Badge
                      className={cn(
                        statusConfig[currentExecution.status].bg,
                        statusConfig[currentExecution.status].color,
                      )}
                    >
                      {currentExecution.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Started</p>
                      <p>{formatTime(currentExecution.startedAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p>{formatDuration(currentExecution.duration)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Mode</p>
                      <p className="capitalize">{currentExecution.mode}</p>
                    </div>
                  </div>
                </div>

                {/* Node Executions */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Node Executions</h4>
                  <div className="space-y-2">
                    {currentExecution.nodeExecutions.map((nodeExec, index) => {
                      const config = statusConfig[nodeExec.status]
                      const StatusIcon = config.icon

                      return (
                        <div
                          key={`${nodeExec.nodeId}-${index}`}
                          className="rounded-md border border-border bg-card p-3"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <StatusIcon
                              className={cn("h-4 w-4", config.color, nodeExec.status === "running" && "animate-spin")}
                            />
                            <span className="text-sm font-medium">{nodeExec.nodeId}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {formatDuration(nodeExec.duration)}
                            </span>
                          </div>

                          {nodeExec.error && (
                            <div className="mt-2 rounded bg-destructive/10 p-2">
                              <p className="text-xs text-destructive">{nodeExec.error}</p>
                            </div>
                          )}

                          {nodeExec.output && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Output:</p>
                              <pre className="rounded bg-muted p-2 text-xs overflow-auto max-h-24">
                                {JSON.stringify(nodeExec.output, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Select an execution to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
