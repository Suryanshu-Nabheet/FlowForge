"use client";

import { ExecutionList } from "@/components/dashboard/execution-list";

export default function ExecutionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Executions</h1>
        <p className="text-muted-foreground">
          View the history and status of your workflow runs.
        </p>
      </div>
      <ExecutionList />
    </div>
  );
}
