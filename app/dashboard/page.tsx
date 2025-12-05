"use client";

import { WorkflowList } from "@/components/dashboard/workflow-list";
import { StatsCards } from "@/components/dashboard/stats-cards";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your automation activity.
        </p>
      </div>

      <StatsCards />
      <WorkflowList />
    </div>
  );
}
