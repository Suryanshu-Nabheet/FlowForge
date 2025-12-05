"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { WorkflowCanvas } from "@/components/workflow/workflow-canvas";
import { useWorkflowStore } from "@/lib/store/workflow-store";
import { Loader2 } from "lucide-react";

export default function WorkflowEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { workflows, setCurrentWorkflow } = useWorkflowStore();
  const [loading, setLoading] = useState(true);

  const workflowId = params.id as string;

  useEffect(() => {
    if (workflowId) {
      const workflow = workflows.find((w) => w.id === workflowId);
      if (workflow) {
        setCurrentWorkflow(workflow);
        setLoading(false);
      } else {
        // Workflow not found, redirect to dashboard
        router.push("/dashboard");
      }
    }
  }, [workflowId, workflows, setCurrentWorkflow, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <WorkflowCanvas workflowId={workflowId} />
    </div>
  );
}
