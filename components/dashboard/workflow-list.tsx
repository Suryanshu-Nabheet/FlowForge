"use client";

import { useState } from "react";
import Link from "next/link";
import { useWorkflowStore } from "@/lib/store/workflow-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  Play,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { Workflow } from "@/types/workflow";
import { v4 as uuidv4 } from "uuid";
import { formatDistanceToNow } from "date-fns";

export function WorkflowList() {
  const { workflows, createWorkflow, deleteWorkflow } = useWorkflowStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newWorkflowDesc, setNewWorkflowDesc] = useState("");

  const handleCreateWorkflow = () => {
    if (!newWorkflowName.trim()) return;

    const newWorkflow: Workflow = {
      id: uuidv4(),
      name: newWorkflowName,
      description: newWorkflowDesc,
      nodes: [],
      edges: [],
      settings: {
        timezone: "UTC",
        saveExecutions: "all",
        executionTimeout: 300,
        maxRetries: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: false,
    };

    createWorkflow(newWorkflow);
    setIsCreateDialogOpen(false);
    setNewWorkflowName("");
    setNewWorkflowDesc("");
  };

  const handleDeleteWorkflow = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this workflow?")) {
      deleteWorkflow(id);
    }
  };

  const handleDuplicateWorkflow = (workflow: Workflow, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const duplicated: Workflow = {
      ...workflow,
      id: uuidv4(),
      name: `${workflow.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: false,
    };
    createWorkflow(duplicated);
  };

  if (workflows.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center rounded-lg border border-dashed text-center animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Plus className="h-10 w-10 text-primary" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">No workflows yet</h2>
        <p className="mt-2 text-muted-foreground max-w-sm">
          Create your first workflow to start automating your tasks.
        </p>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="mt-6"
          size="lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
              <DialogDescription>
                Give your workflow a name and description to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  placeholder="My Awesome Workflow"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description (Optional)</Label>
                <Input
                  id="desc"
                  value={newWorkflowDesc}
                  onChange={(e) => setNewWorkflowDesc(e.target.value)}
                  placeholder="What does this workflow do?"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateWorkflow}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Workflows</h2>
          <p className="text-muted-foreground">
            Manage and monitor your automation workflows.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" />
              New Workflow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
              <DialogDescription>
                Give your workflow a name and description to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  placeholder="My Awesome Workflow"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description (Optional)</Label>
                <Input
                  id="desc"
                  value={newWorkflowDesc}
                  onChange={(e) => setNewWorkflowDesc(e.target.value)}
                  placeholder="What does this workflow do?"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateWorkflow}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {workflows.map((workflow) => (
          <Link key={workflow.id} href={`/workflow/${workflow.id}`}>
            <Card className="group relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 cursor-pointer h-full">
              <div className="absolute top-0 right-0 p-4 opacity-0 transition-opacity group-hover:opacity-100 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => handleDuplicateWorkflow(workflow, e)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => handleDeleteWorkflow(workflow.id, e)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardHeader className="pb-4">
                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                    workflow.isActive
                      ? "bg-green-500/10 text-green-500"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {workflow.isActive ? (
                    <Play className="h-5 w-5" />
                  ) : (
                    <Zap className="h-5 w-5" />
                  )}
                </div>
                <CardTitle className="line-clamp-1">{workflow.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {workflow.description || "No description provided."}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(workflow.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(workflow.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t bg-muted/20 pt-4">
                <div className="flex w-full items-center justify-between text-sm font-medium text-primary">
                  <span className="flex items-center gap-2">
                    {workflow.nodes.length} nodes
                  </span>
                  <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
