"use client";

import { Suspense } from "react";
import { WorkflowList } from "@/components/dashboard/workflow-list";

export default function WorkflowsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
        <p className="text-muted-foreground">
          Create, manage, and monitor your automation workflows.
        </p>
      </div>
      <Suspense fallback={<div>Loading workflows...</div>}>
        <WorkflowList />
      </Suspense>
    </div>
  );
}
