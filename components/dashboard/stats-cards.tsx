"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Workflow, Play, CheckCircle, XCircle, TrendingUp, TrendingDown } from "lucide-react"

interface StatCard {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
}

const stats: StatCard[] = [
  {
    title: "Total Workflows",
    value: "24",
    change: "+3 this week",
    changeType: "positive",
    icon: Workflow,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
  },
  {
    title: "Executions Today",
    value: "1,248",
    change: "+12% vs yesterday",
    changeType: "positive",
    icon: Play,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
  },
  {
    title: "Success Rate",
    value: "98.5%",
    change: "+0.3% this week",
    changeType: "positive",
    icon: CheckCircle,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/10",
  },
  {
    title: "Failed Executions",
    value: "18",
    change: "-5 vs yesterday",
    changeType: "positive",
    icon: XCircle,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={cn("rounded-md p-2", stat.iconBg)}>
                <Icon className={cn("h-4 w-4", stat.iconColor)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {stat.changeType === "positive" ? (
                  <TrendingUp className="h-3 w-3 text-green-400" />
                ) : stat.changeType === "negative" ? (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                ) : null}
                <span
                  className={cn(
                    stat.changeType === "positive" && "text-green-400",
                    stat.changeType === "negative" && "text-red-400",
                    stat.changeType === "neutral" && "text-muted-foreground",
                  )}
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
