"use client";

import { useSettingsStore } from "@/lib/store/settings-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function TeamPage() {
  const { userProfile } = useSettingsStore();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">
            Manage your team and their permissions.
          </p>
        </div>
        <Button variant="outline" disabled>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member (Pro)
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={userProfile.avatar} />
              <AvatarFallback>
                {userProfile.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{userProfile.name}</CardTitle>
              <p className="text-sm text-muted-foreground">Owner</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {userProfile.email}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
