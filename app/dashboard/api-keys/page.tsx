"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ApiKeysPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">
            Manage API keys for accessing the FlowForge API.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Key
        </Button>
      </div>

      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No API keys generated yet.</p>
      </div>
    </div>
  );
}
