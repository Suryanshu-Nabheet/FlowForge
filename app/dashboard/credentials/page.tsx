"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Key } from "lucide-react";

export default function CredentialsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credentials</h1>
          <p className="text-muted-foreground">
            Manage your API keys and secrets securely.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Credential
        </Button>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>OpenRouter API Key</CardTitle>
              <CardDescription>**************sk-1234</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Google Sheets OAuth</CardTitle>
              <CardDescription>Connected as user@example.com</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
