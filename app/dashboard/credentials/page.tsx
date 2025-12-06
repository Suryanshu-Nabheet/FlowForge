"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Key, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "@/lib/store/settings-store";
import { v4 as uuidv4 } from "uuid";

export default function CredentialsPage() {
  const { credentials, addCredential, removeCredential } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [value, setValue] = useState("");

  const handleCreate = () => {
    if (!name || !service || !value) return;

    addCredential({
      id: uuidv4(),
      name,
      service,
      value, // In a real app, encrypt this!
      createdAt: new Date(),
    });
    setIsOpen(false);
    setName("");
    setService("");
    setValue("");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credentials</h1>
          <p className="text-muted-foreground">
            Manage your API keys and secrets securely.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Credential
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Credential</DialogTitle>
              <DialogDescription>
                Store a new API key or secret for use in your workflows.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="My API Key"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service">Service</Label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI / OpenRouter</SelectItem>
                    <SelectItem value="google">Google Cloud</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="password"
                  placeholder="sk-..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>Save Credential</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {credentials.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
            No credentials added yet. Add one to get started.
          </div>
        ) : (
          credentials.map((cred) => (
            <Card key={cred.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Key className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle>{cred.name}</CardTitle>
                  <CardDescription className="capitalize">
                    {cred.service} • Added{" "}
                    {new Date(cred.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive/90"
                  onClick={() => removeCredential(cred.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
