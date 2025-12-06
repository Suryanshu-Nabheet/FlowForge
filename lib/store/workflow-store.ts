import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Workflow, WorkflowNode, WorkflowEdge, WorkflowExecution } from "@/types/workflow"

interface WorkflowState {
  // Current workflow
  currentWorkflow: Workflow | null
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNodeId: string | null

  // Workflow list
  workflows: Workflow[]

  // Executions
  executions: WorkflowExecution[]
  currentExecution: WorkflowExecution | null

  // Canvas state
  zoom: number
  position: { x: number; y: number }

  // UI state
  isSidebarOpen: boolean
  isNodePanelOpen: boolean
  isExecutionLogOpen: boolean

  // Actions
  setCurrentWorkflow: (workflow: Workflow | null) => void
  setNodes: (nodes: WorkflowNode[]) => void
  setEdges: (edges: WorkflowEdge[]) => void
  addNode: (node: WorkflowNode) => void
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void
  removeNode: (nodeId: string) => void
  addEdge: (edge: WorkflowEdge) => void
  removeEdge: (edgeId: string) => void
  selectNode: (nodeId: string | null) => void
  setZoom: (zoom: number) => void
  setPosition: (position: { x: number; y: number }) => void
  toggleSidebar: () => void
  toggleNodePanel: () => void
  toggleExecutionLog: () => void

  // Workflow CRUD
  createWorkflow: (workflow: Workflow) => void
  updateWorkflow: (workflowId: string, updates: Partial<Workflow>) => void
  deleteWorkflow: (workflowId: string) => void
  saveCurrentWorkflow: () => void

  // Executions
  addExecution: (execution: WorkflowExecution) => void
  updateExecution: (executionId: string, updates: Partial<WorkflowExecution>) => void
  setCurrentExecution: (execution: WorkflowExecution | null) => void
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  // Initial state
  currentWorkflow: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  workflows: [],
  executions: [],
  currentExecution: null,
  zoom: 1,
  position: { x: 0, y: 0 },
  isSidebarOpen: true,
  isNodePanelOpen: true,
  isExecutionLogOpen: false,

  // Actions
  setCurrentWorkflow: (workflow) =>
    set({
      currentWorkflow: workflow,
      nodes: workflow?.nodes || [],
      edges: workflow?.edges || [],
      selectedNodeId: null,
    }),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  updateNode: (nodeId, updates) =>
    set((state) => ({
      nodes: state.nodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)),
    })),

  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    })),

  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),

  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    })),

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  setZoom: (zoom) => set({ zoom }),
  setPosition: (position) => set({ position }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleNodePanel: () => set((state) => ({ isNodePanelOpen: !state.isNodePanelOpen })),
  toggleExecutionLog: () => set((state) => ({ isExecutionLogOpen: !state.isExecutionLogOpen })),

  createWorkflow: (workflow) =>
    set((state) => ({
      workflows: [...state.workflows, workflow],
    })),

  updateWorkflow: (workflowId, updates) =>
    set((state) => ({
      workflows: state.workflows.map((wf) =>
        wf.id === workflowId ? { ...wf, ...updates, updatedAt: new Date() } : wf,
      ),
    })),

  deleteWorkflow: (workflowId) =>
    set((state) => ({
      workflows: state.workflows.filter((wf) => wf.id !== workflowId),
      currentWorkflow: state.currentWorkflow?.id === workflowId ? null : state.currentWorkflow,
    })),

  saveCurrentWorkflow: () => {
    const state = get()
    if (state.currentWorkflow) {
      const updated = {
        ...state.currentWorkflow,
        nodes: state.nodes,
        edges: state.edges,
        updatedAt: new Date(),
      }
      set((state) => ({
        currentWorkflow: updated,
        workflows: state.workflows.map((wf) => (wf.id === updated.id ? updated : wf)),
      }))
    }
  },

  addExecution: (execution) =>
    set((state) => ({
      executions: [execution, ...state.executions].slice(0, 100),
    })),

  updateExecution: (executionId, updates) =>
    set((state) => ({
      executions: state.executions.map((exec) => (exec.id === executionId ? { ...exec, ...updates } : exec)),
      currentExecution:
        state.currentExecution?.id === executionId
          ? { ...state.currentExecution, ...updates }
          : state.currentExecution,
    })),

  setCurrentExecution: (execution) => set({ currentExecution: execution }),
}));
