"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const templates = [
  {
    title: "Email Automation",
    description: "Automatically send emails based on webhook triggers.",
    author: "FlowForge Team",
    downloads: "1.2k",
    tag: "Marketing",
  },
  {
    title: "Slack Notifier",
    description: "Post updates to Slack channels from any source.",
    author: "FlowForge Team",
    downloads: "850",
    tag: "Communication",
  },
  {
    title: "Data Sync",
    description: "Sync data between Google Sheets and your database.",
    author: "Communtiy",
    downloads: "2.1k",
    tag: "Data",
  },
];

export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground">
          Explore pre-built templates and nodes to speed up your automation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{template.tag}</Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Download className="mr-1 h-3 w-3" />
                  {template.downloads}
                </div>
              </div>
              <CardTitle className="mt-4">{template.title}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button className="w-full" variant="secondary">
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
