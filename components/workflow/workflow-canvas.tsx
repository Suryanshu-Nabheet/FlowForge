"use client";

import type React from "react";

import { useCallback, useRef, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useWorkflowStore } from "@/lib/store/workflow-store";
import { WorkflowNode } from "./workflow-node";
import { NodePalette } from "./node-palette";
import { NodeEditor } from "./node-editor";
import { ExecutionLog } from "./execution-log";
import type { NodeDefinition, WorkflowNode as WFNode } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import {
  Play,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  PanelLeftClose,
  PanelRightClose,
  History,
} from "lucide-react";
import { executeWorkflow } from "@/lib/workflow-engine/executor";

const nodeTypes = {
  workflowNode: WorkflowNode,
};

interface WorkflowCanvasProps {
  workflowId?: string;
}

export function WorkflowCanvas({ workflowId }: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const {
    nodes: storeNodes,
    edges: storeEdges,
    selectedNodeId,
    currentWorkflow,
    isNodePanelOpen,
    isExecutionLogOpen,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
    addNode,
    addEdge: addStoreEdge,
    selectNode,
    toggleNodePanel,
    toggleExecutionLog,
    saveCurrentWorkflow,
    addExecution,
    updateExecution,
  } = useWorkflowStore();

  // Convert store nodes to ReactFlow nodes
  const initialNodes: Node[] = useMemo(
    () =>
      storeNodes.map((node) => ({
        id: node.id,
        type: "workflowNode",
        position: node.position,
        data: {
          ...node.data,
          definitionId: node.definitionId,
        },
        selected: node.id === selectedNodeId,
      })),
    [storeNodes, selectedNodeId]
  );

  // Convert store edges to ReactFlow edges
  const initialEdges: Edge[] = useMemo(
    () =>
      storeEdges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: "smoothstep",
        animated: true,
        style: { stroke: "var(--neon-blue)", strokeWidth: 2 },
      })),
    [storeEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        type: "smoothstep",
        animated: true,
        style: { stroke: "var(--neon-blue)", strokeWidth: 2 },
      } as Edge;

      setEdges((eds) => addEdge(newEdge, eds));
      addStoreEdge({
        id: newEdge.id,
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
      });
    },
    [setEdges, addStoreEdge]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      const nodeDefinition: NodeDefinition = JSON.parse(data);

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left - 90,
        y: event.clientY - reactFlowBounds.top - 30,
      };

      const newNode: WFNode = {
        id: `${nodeDefinition.id}-${Date.now()}`,
        definitionId: nodeDefinition.id,
        position,
        data: {
          label: nodeDefinition.displayName,
          parameters: nodeDefinition.parameters.reduce(
            (acc, param) => ({
              ...acc,
              [param.id]: param.default,
            }),
            {}
          ),
        },
      };

      addNode(newNode);
      setNodes((nds) => [
        ...nds,
        {
          id: newNode.id,
          type: "workflowNode",
          position: newNode.position,
          data: {
            ...newNode.data,
            definitionId: newNode.definitionId,
          },
        },
      ]);
    },
    [addNode, setNodes]
  );

  const handleNodeDragStart = useCallback(() => {
    // Could add visual feedback here
  }, []);

  const handleExecute = useCallback(async () => {
    if (!currentWorkflow) return;

    // Convert local ReactFlow nodes back to WorkflowNodes
    const workflowNodes: WFNode[] = nodes.map((n) => ({
      id: n.id,
      definitionId: (n.data as { definitionId: string }).definitionId,
      position: n.position,
      data: {
        label: (n.data as { label: string }).label,
        parameters: (n.data as { parameters: Record<string, unknown> })
          .parameters,
      },
    }));

    // Convert local ReactFlow edges back to WorkflowEdges
    const workflowEdges = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle || undefined,
      targetHandle: e.targetHandle || undefined,
    }));

    // Sync to store first (auto-save)
    setStoreNodes(workflowNodes);
    setStoreEdges(workflowEdges);
    saveCurrentWorkflow();

    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: workflowNodes,
      edges: workflowEdges,
    };

    try {
      await executeWorkflow(updatedWorkflow, {
        onUpdate: (execution) => {
          if (execution.id) {
            const existing = useWorkflowStore
              .getState()
              .executions.find((e) => e.id === execution.id);
            if (existing) {
              updateExecution(execution.id, execution);
            } else {
              addExecution(execution);
            }
          }
        },
      });
    } catch (error) {
      console.error("Workflow execution failed:", error);
    }
  }, [
    currentWorkflow,
    nodes,
    edges,
    addExecution,
    updateExecution,
    setStoreNodes,
    setStoreEdges,
    saveCurrentWorkflow,
  ]);

  const handleSave = useCallback(() => {
    setStoreNodes(
      nodes.map((n) => ({
        id: n.id,
        definitionId: (n.data as { definitionId: string }).definitionId,
        position: n.position,
        data: {
          label: (n.data as { label: string }).label,
          parameters: (n.data as { parameters: Record<string, unknown> })
            .parameters,
        },
      }))
    );
    setStoreEdges(
      edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle || undefined,
        targetHandle: e.targetHandle || undefined,
      }))
    );
    saveCurrentWorkflow();
  }, [nodes, edges, setStoreNodes, setStoreEdges, saveCurrentWorkflow]);

  return (
    <div className="flex h-full w-full">
      {/* Node Palette */}
      {isNodePanelOpen && (
        <div className="w-64 flex-shrink-0">
          <NodePalette onNodeDragStart={handleNodeDragStart} />
        </div>
      )}

      {/* Canvas */}
      <div
        className="bg-background text-foreground relative flex-1"
        ref={reactFlowWrapper}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[20, 20]} // Match grid size
          className="bg-black" // Force black bg for the dots to sit on
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#404040" // Dark Gray dots
          />
          <Controls
            className="!bg-card !border-border"
            showZoom={true}
            showFitView={true}
            showInteractive={false}
          />
          <MiniMap
            className="!bg-card !border-border"
            nodeColor="var(--primary)"
            maskColor="rgba(0, 0, 0, 0.8)"
          />

          {/* Toolbar */}
          <Panel position="top-center">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-2 shadow-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleNodePanel}
                className="h-8 w-8"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>

              <div className="h-6 w-px bg-border" />

              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Redo className="h-4 w-4" />
              </Button>

              <div className="h-6 w-px bg-border" />

              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Maximize className="h-4 w-4" />
              </Button>

              <div className="h-6 w-px bg-border" />

              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="h-8 bg-transparent"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>

              <Button
                size="sm"
                onClick={handleExecute}
                className="h-8 bg-primary hover:bg-primary/90"
              >
                <Play className="mr-2 h-4 w-4" />
                Execute
              </Button>

              <div className="h-6 w-px bg-border" />

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleExecutionLog}
                className="h-8 w-8"
              >
                <History className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  selectNode(selectedNodeId ? null : storeNodes[0]?.id || null)
                }
                className="h-8 w-8"
              >
                <PanelRightClose className="h-4 w-4" />
              </Button>
            </div>
          </Panel>
        </ReactFlow>

        {/* Vignette Overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-transparent [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

        {/* Execution Log Panel */}
        {isExecutionLogOpen && (
          <div className="absolute bottom-0 left-0 right-0 z-50 h-64 border-t border-border bg-card">
            <ExecutionLog />
          </div>
        )}
      </div>

      {/* Node Editor */}
      {selectedNodeId && <NodeEditor />}
    </div>
  );
}
