# FlowForge ⚡️

FlowForge is a powerful, production-ready workflow automation platform similar to n8n. It allows you to build complex automation workflows visually using a drag-and-drop node editor.

## Features

- **Visual Workflow Builder**: Intuitive drag-and-drop interface powered by React Flow.
- **Node System**: Rich set of nodes including Triggers (Webhook, Schedule), Actions (HTTP Request, Email), Logic (If/Else, Switch, Merge), and AI.
- **AI Integration**: Built-in AI nodes powered by OpenRouter (GPT-4, Claude 3.5, Llama 3) to process text and data intelligently.
- **Execution Engine**: Robust engine supporting node-by-node execution, error handling, and retries.
- **Local Storage**: Privacy-first design where all workflows and executions are stored locally in your browser (LocalStorage).
- **Execution History**: Detailed logs of past workflow runs with input/output inspection.
- **Dark Mode**: Sleek, professional dark UI designed for long work sessions.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/flowforge.git
   cd flowforge
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure Environment Variables:
   Copy `env.example` to `.env.local` and add your keys.

   ```bash
   cp env.example .env.local
   ```

   _Required for AI nodes:_ Add your `OPENROUTER_API_KEY`.

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
/app
  /dashboard       # Dashboard pages (Workflows, Settings)
  /workflow/[id]   # Workflow Editor
  /api             # Backend API routes (OpenRouter proxy)
/components
  /dashboard       # Dashboard UI components
  /workflow        # Editor components (Canvas, Nodes, Palette)
  /ui              # Shared UI components (Button, Input, etc.)
/lib
  /engine          # Workflow execution engine logic
  /nodes           # Node definitions and registry
  /store           # Zustand state management
/types             # TypeScript definitions
```

## 🛠 Usage Guide

### Creating a Workflow

1. Go to the **Dashboard**.
2. Click **New Workflow**.
3. Give it a name and description.
4. You will be redirected to the editor.

### Adding Nodes

1. In the Editor, open the **Node Palette** (left sidebar).
2. Drag and drop a node (e.g., "Manual Trigger") onto the canvas.
3. Drag another node (e.g., "HTTP Request").

### Connecting Nodes

1. Click and drag from the **output handle** (right side) of the first node.
2. Connect it to the **input handle** (left side) of the second node.

### Configuring Nodes

1. Click on a node to open the **Node Editor** (right sidebar).
2. Fill in the parameters (e.g., URL for HTTP Request).

### Text Interpolation

You can use double curly braces to reference data from previous nodes:

```
{{ data.userId }}
```

Or specifically from the input:

```
{{ input.body.message }}
```

### Running Workflows

1. Click the **Execute** button in the top toolbar.
2. Watch the execution progress (nodes will glow).
3. Check the **Execution Log** (bottom panel) for details.

## 🤖 AI Integration

FlowForge uses OpenRouter to access top-tier LLMs.

1. Add an **AI Chat** node.
2. Select a model (e.g., GPT-4o).
3. Enter your prompt. You can reference input data: "Summarize this email: {{ email.body }}"
4. Make sure your `OPENROUTER_API_KEY` is set in `.env.local`.

## 📦 Deployment

### Vercel

FlowForge is optimized for Vercel.

1. Push to GitHub.
2. Import project in Vercel.
3. Add `OPENROUTER_API_KEY` to Environment Variables.
4. Deploy.

## 🤝 Contributing

Contributions are welcome! Please read `CONTRIBUTING.md` for details.

## License

MIT
