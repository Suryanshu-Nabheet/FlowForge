# FlowForge Ω - Architecture Masterplan

## 1. System Overview

FlowForge Ω is a browser-first, AI-native workflow orchestration platform designed for high-performance automation. Unlike traditional server-centric platforms (n8n), FlowForge Ω utilizes a hybrid execution model where the orchestration happens in the client (browser) or can be offloaded to a serverless worker, powered by an intelligent AI layer.

## 2. Core Layers

### Layer 1: The AI Tensor (Intelligence Layer)

- **Role**: Autonomous decision making, code generation, and error healing.
- **Components**:
  - `PromptEngine`: Converts natural language to structural workflow operations.
  - `NodeGenerator`: Creates executable JS code for custom nodes on-the-fly.
  - `Healer`: Analyzes execution traces to suggest fixes for runtime errors.
- **Integration**: Direct pipe to OpenRouter API.

### Layer 2: The Hyper-Engine (Execution Layer)

- **Role**: Execution of the Directed Acyclic Graph (DAG).
- **Key Features**:
  - **Topological sort**: Execution order based on dependency resolution.
  - **Concurrency**: `Promise.all` based parallel execution of non-dependent branches.
  - **Snapshots**: State capture at every node ingress/egress.
  - **Isolation**: Safe evaluation of user code using `Function` constructors (or sandboxed if needed).

### Layer 3: State & Persistence (Memory Layer)

- **Role**: Management of workflow definitions and execution history.
- **Strategy**: "Local-First" architecture.
  - Primary: `IndexedDB` (via `idb-keyval`) for large blob storage (snapshots).
  - Sync: State reconciliation with Zustand.
  - Export: JSON/YAML serialization for portability.

### Layer 4: The Interface (Visual Layer)

- **Role**: User interaction and visualization.
- **Stack**: Next.js 14, React Flow 12, Tailwind v4.
- **Features**:
  - Real-time execution highlighters (animated edges).
  - AI Chat Overlay for "Text-to-Workflow" mutations.
  - Time-travel debugger (scrubbing through persistence snapshots).

## 3. Data Structures

### `Workflow`

The source of truth.

```typescript
interface Workflow {
  id: string;
  graph: {
    nodes: Node[];
    edges: Edge[];
  };
  config: WorkflowConfig;
  version: number;
}
```

### `ExecutionFrame`

A single point in time during a workflow run.

```typescript
interface ExecutionFrame {
  nodeId: string;
  timestamp: number;
  input: any;
  output: any;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  metrics: {
    durationMs: number;
    memoryUsage?: number;
  };
}
```

## 4. Execution Flow

1.  **Parse**: Validate workflow integrity (detect cycles, disconnected nodes).
2.  **Plan**: Generate an Execution Plan (ordered list of operations).
3.  **Run**:
    - Loop through plan.
    - If node satisfies dependencies -> Execute.
    - If node creates multiple outputs (Branching) -> Spawn parallel tasks.
    - If error -> Pause & Invoke AI Healer (if enabled).
4.  **Persist**: Save `ExecutionLog` to LocalStorage/IndexedDB.

## 5. Security Strategy

- **Credential Management**: Encryption at rest (AES-GCM) in LocalStorage.
- **Code Injection**: Strict scrubbing of inputs; future plan for WASM isolation.
- **API Proxy**: All external calls routed through Next.js API routes to hide API keys and handle CORS.

## 6. Future Roadmap

- **WASM Worker**: Move execution engine to a Web Worker for non-blocking UI.
- **CRDTs**: Real-time collaboration via Yjs.
- **Vector Database**: Client-side vector search (Voy/Orama) for semantic node search.
