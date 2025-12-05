"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { nodeRegistry } from "@/lib/nodes/node-registry"
import type { NodeCategory, NodeDefinition } from "@/types/workflow"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Search,
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
  ChevronDown,
  ChevronRight,
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

const categoryLabels: Record<NodeCategory, string> = {
  triggers: "Triggers",
  actions: "Actions",
  "flow-control": "Flow Control",
  data: "Data",
  integrations: "Integrations",
  ai: "AI",
  communication: "Communication",
  utilities: "Utilities",
}

const categoryIcons: Record<NodeCategory, React.ComponentType<{ className?: string }>> = {
  triggers: Zap,
  actions: Globe,
  "flow-control": GitBranch,
  data: Edit,
  integrations: Sheet,
  ai: Bot,
  communication: MessageSquare,
  utilities: Timer,
}

interface NodePaletteProps {
  onNodeDragStart: (event: React.DragEvent, nodeDefinition: NodeDefinition) => void
}

export function NodePalette({ onNodeDragStart }: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Set<NodeCategory>>(new Set(["triggers", "actions"]))

  const categorizedNodes = useMemo(() => {
    const nodes = searchQuery ? nodeRegistry.search(searchQuery) : nodeRegistry.getAll()

    const grouped = new Map<NodeCategory, NodeDefinition[]>()
    nodes.forEach((node) => {
      const category = grouped.get(node.category) || []
      category.push(node)
      grouped.set(node.category, category)
    })

    return grouped
  }, [searchQuery])

  const toggleCategory = (category: NodeCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const handleDragStart = (event: React.DragEvent, nodeDefinition: NodeDefinition) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(nodeDefinition))
    event.dataTransfer.effectAllowed = "move"
    onNodeDragStart(event, nodeDefinition)
  }

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Nodes</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Node List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {Array.from(categorizedNodes.entries()).map(([category, nodes]) => {
            const CategoryIcon = categoryIcons[category] || Zap
            const isExpanded = expandedCategories.has(category)

            return (
              <div key={category} className="mb-2">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <CategoryIcon className="h-4 w-4" />
                  <span>{categoryLabels[category]}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{nodes.length}</span>
                </button>

                {/* Nodes */}
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {nodes.map((node) => {
                      const Icon = iconMap[node.icon] || Zap
                      return (
                        <div
                          key={node.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, node)}
                          className={cn(
                            "flex cursor-grab items-center gap-3 rounded-md border border-transparent px-3 py-2",
                            "bg-muted/50 hover:bg-muted hover:border-border",
                            "transition-all duration-150 active:cursor-grabbing",
                          )}
                        >
                          <div className="rounded-md bg-background p-1.5">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{node.displayName}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">{node.description}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
