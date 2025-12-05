"use client"

import { useMemo } from "react"
import { nodeRegistry } from "@/lib/nodes/node-registry"
import { useWorkflowStore } from "@/lib/store/workflow-store"
import type { NodeParameter } from "@/types/workflow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { X, Trash2, Copy, Settings } from "lucide-react"

export function NodeEditor() {
  const { nodes, selectedNodeId, selectNode, updateNode, removeNode } = useWorkflowStore()

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId), [nodes, selectedNodeId])

  const definition = useMemo(() => (selectedNode ? nodeRegistry.get(selectedNode.definitionId) : null), [selectedNode])

  if (!selectedNode || !definition) {
    return (
      <div className="flex h-full flex-col items-center justify-center border-l border-border bg-card p-6 text-center">
        <Settings className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-sm font-medium text-muted-foreground">No node selected</h3>
        <p className="mt-1 text-xs text-muted-foreground/70">Click on a node to edit its properties</p>
      </div>
    )
  }

  const handleParameterChange = (paramId: string, value: unknown) => {
    updateNode(selectedNode.id, {
      data: {
        ...selectedNode.data,
        parameters: {
          ...selectedNode.data.parameters,
          [paramId]: value,
        },
      },
    })
  }

  const handleLabelChange = (label: string) => {
    updateNode(selectedNode.id, {
      data: {
        ...selectedNode.data,
        label,
      },
    })
  }

  const handleDelete = () => {
    removeNode(selectedNode.id)
  }

  const handleDuplicate = () => {
    const newNode = {
      ...selectedNode,
      id: crypto.randomUUID(),
      position: {
        x: selectedNode.position.x + 50,
        y: selectedNode.position.y + 50,
      },
      data: {
        ...selectedNode.data,
        label: `${selectedNode.data.label} (copy)`,
      },
    }
    useWorkflowStore.getState().addNode(newNode)
  }

  const renderParameter = (param: NodeParameter) => {
    const value = selectedNode.data.parameters[param.id] ?? param.default

    // Check showWhen condition
    if (param.showWhen) {
      const conditionValue = selectedNode.data.parameters[param.showWhen.field]
      if (conditionValue !== param.showWhen.value) {
        return null
      }
    }

    switch (param.type) {
      case "string":
        return (
          <div key={param.id} className="space-y-2">
            <Label htmlFor={param.id} className="text-xs">
              {param.displayName}
              {param.required && <span className="text-destructive"> *</span>}
            </Label>
            <Input
              id={param.id}
              value={String(value ?? "")}
              onChange={(e) => handleParameterChange(param.id, e.target.value)}
              placeholder={param.placeholder}
            />
            {param.description && <p className="text-xs text-muted-foreground">{param.description}</p>}
          </div>
        )

      case "number":
        return (
          <div key={param.id} className="space-y-2">
            <Label htmlFor={param.id} className="text-xs">
              {param.displayName}
              {param.required && <span className="text-destructive"> *</span>}
            </Label>
            <Input
              id={param.id}
              type="number"
              value={Number(value ?? 0)}
              onChange={(e) => handleParameterChange(param.id, Number(e.target.value))}
              placeholder={param.placeholder}
            />
            {param.description && <p className="text-xs text-muted-foreground">{param.description}</p>}
          </div>
        )

      case "boolean":
        return (
          <div key={param.id} className="flex items-center justify-between">
            <div>
              <Label htmlFor={param.id} className="text-xs">
                {param.displayName}
              </Label>
              {param.description && <p className="text-xs text-muted-foreground">{param.description}</p>}
            </div>
            <Switch
              id={param.id}
              checked={Boolean(value)}
              onCheckedChange={(checked) => handleParameterChange(param.id, checked)}
            />
          </div>
        )

      case "select":
        return (
          <div key={param.id} className="space-y-2">
            <Label htmlFor={param.id} className="text-xs">
              {param.displayName}
              {param.required && <span className="text-destructive"> *</span>}
            </Label>
            <Select value={String(value ?? "")} onValueChange={(v) => handleParameterChange(param.id, v)}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${param.displayName}`} />
              </SelectTrigger>
              <SelectContent>
                {param.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {param.description && <p className="text-xs text-muted-foreground">{param.description}</p>}
          </div>
        )

      case "code":
      case "json":
        return (
          <div key={param.id} className="space-y-2">
            <Label htmlFor={param.id} className="text-xs">
              {param.displayName}
              {param.required && <span className="text-destructive"> *</span>}
            </Label>
            <Textarea
              id={param.id}
              value={typeof value === "string" ? value : JSON.stringify(value, null, 2)}
              onChange={(e) => {
                if (param.type === "json") {
                  try {
                    handleParameterChange(param.id, JSON.parse(e.target.value))
                  } catch {
                    handleParameterChange(param.id, e.target.value)
                  }
                } else {
                  handleParameterChange(param.id, e.target.value)
                }
              }}
              placeholder={param.placeholder}
              className="font-mono text-xs min-h-[120px]"
            />
            {param.description && <p className="text-xs text-muted-foreground">{param.description}</p>}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-full w-80 flex-col border-l border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{definition.displayName}</h3>
          <p className="text-xs text-muted-foreground">Configure node</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => selectNode(null)} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {/* Node Label */}
          <div className="space-y-2">
            <Label htmlFor="label" className="text-xs">
              Node Name
            </Label>
            <Input
              id="label"
              value={selectedNode.data.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder={definition.displayName}
            />
          </div>

          <Separator />

          {/* Parameters */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Parameters</h4>
            {definition.parameters.map(renderParameter)}
          </div>

          {/* Inputs/Outputs Info */}
          {(definition.inputs.length > 0 || definition.outputs.length > 0) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Connections</h4>
                {definition.inputs.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Inputs:</p>
                    <div className="flex flex-wrap gap-1">
                      {definition.inputs.map((input) => (
                        <span key={input.id} className="rounded bg-muted px-2 py-0.5 text-xs">
                          {input.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {definition.outputs.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Outputs:</p>
                    <div className="flex flex-wrap gap-1">
                      {definition.outputs.map((output) => (
                        <span key={output.id} className="rounded bg-primary/20 px-2 py-0.5 text-xs text-primary">
                          {output.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDuplicate} className="flex-1 bg-transparent">
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete} className="flex-1">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
