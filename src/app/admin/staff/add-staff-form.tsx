"use client";

import { useActionState } from "react";
import { createStaffAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateStaffState = { error: string; success?: boolean };
const initialState: CreateStaffState = { error: "" };

export function AddStaffForm() {
  const [state, formAction, isPending] = useActionState(
    createStaffAction,
    initialState,
  );

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <h2 className="font-heading text-sm font-semibold text-foreground">
        Add New Account
      </h2>
      <form action={formAction} className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="new-username">Username</Label>
          <Input id="new-username" name="username" type="text" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">Password</Label>
          <Input
            id="new-password"
            name="password"
            type="password"
            required
            minLength={8}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            name="role"
            defaultValue="staff"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Adding..." : "Add Account"}
          </Button>
        </div>
      </form>
      {state?.error && (
        <p className="mt-3 text-sm text-destructive">{state.error}</p>
      )}
      {state?.success && (
        <p className="mt-3 text-sm text-primary">
          Account created successfully.
        </p>
      )}
    </div>
  );
}
