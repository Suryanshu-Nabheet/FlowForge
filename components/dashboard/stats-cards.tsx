"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Workflow,
  Play,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import { useWorkflowStore } from "@/lib/store/workflow-store";

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
}

export function StatsCards() {
  const { workflows, executions } = useWorkflowStore();
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    // calculate stats
    const totalWorkflows = workflows.length;

    // Filter executions for "today"
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const executionsToday = executions.filter((exec) => {
      const execDate = new Date(exec.startedAt);
      return execDate >= today;
    });

    const totalExecutionsToday = executionsToday.length;

    const successfulExecutions = executions.filter(
      (exec) => exec.status === "success"
    ).length;
    const failedExecutions = executions.filter(
      (exec) => exec.status === "error"
    ).length;
    const totalExecutions = executions.length;

    const successRate =
      totalExecutions > 0
        ? ((successfulExecutions / totalExecutions) * 100).toFixed(1)
        : "0";

    const newStats: StatCard[] = [
      {
        title: "Total Workflows",
        value: totalWorkflows.toString(),
        change: "Active workflows",
        changeType: "neutral",
        icon: Workflow,
        iconColor: "text-blue-400",
        iconBg: "bg-blue-500/10",
      },
      {
        title: "Executions Today",
        value: totalExecutionsToday.toString(),
        change: "Since midnight",
        changeType: "neutral",
        icon: Play,
        iconColor: "text-purple-400",
        iconBg: "bg-purple-500/10",
      },
      {
        title: "Success Rate",
        value: `${successRate}%`,
        change: "Lifetime average",
        changeType: "positive",
        icon: CheckCircle,
        iconColor: "text-green-400",
        iconBg: "bg-green-500/10",
      },
      {
        title: "Failed Executions",
        value: failedExecutions.toString(),
        change: "Lifetime total",
        changeType: failedExecutions > 0 ? "negative" : "positive",
        icon: XCircle,
        iconColor: "text-red-400",
        iconBg: "bg-red-500/10",
      },
    ];

    setStats(newStats);
  }, [workflows, executions]);

  // If loading or just empty initially
  if (!stats.length) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("rounded-md p-2", stat.iconBg)}>
                <Icon className={cn("h-4 w-4", stat.iconColor)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {stat.changeType === "positive" ? (
                  <TrendingUp className="h-3 w-3 text-green-400" />
                ) : stat.changeType === "negative" ? (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                ) : (
                  <Activity className="h-3 w-3" />
                )}
                <span>{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
