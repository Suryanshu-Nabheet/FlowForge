"use client";

import { useWorkflowStore } from "@/lib/store/workflow-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";

export function ExecutionList() {
  const { executions } = useWorkflowStore();

  if (executions.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
        <Clock className="mb-4 h-10 w-10 text-muted-foreground" />
        <h3 className="text-lg font-semibold">No executions yet</h3>
        <p className="text-sm text-muted-foreground">
          Run a workflow to see the execution history here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Workflow</TableHead>
            <TableHead>Trigger</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Started</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {executions.map((execution) => (
            <TableRow key={execution.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {execution.status === "success" && (
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-500"
                    >
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Success
                    </Badge>
                  )}
                  {execution.status === "error" && (
                    <Badge
                      variant="outline"
                      className="border-red-500 text-red-500"
                    >
                      <XCircle className="mr-1 h-3 w-3" />
                      Failed
                    </Badge>
                  )}
                  {execution.status === "running" && (
                    <Badge
                      variant="outline"
                      className="border-blue-500 text-blue-500"
                    >
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Running
                    </Badge>
                  )}
                  {execution.status === "pending" && (
                    <Badge variant="outline" className="text-muted-foreground">
                      Pending
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {execution.workflowName}
              </TableCell>
              <TableCell className="capitalize">{execution.mode}</TableCell>
              <TableCell>
                {execution.duration ? `${execution.duration}ms` : "-"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(execution.startedAt), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
