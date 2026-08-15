"use client";

import { useActionState, useEffect, useState } from "react";
import { updateRoleAction, deleteStaffAction } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ActionState = { error: string; success?: boolean };
const initialState: ActionState = { error: "" };

export function ManageStaffDialog({
  adminId,
  username,
  role,
  open,
  onOpenChange,
}: {
  adminId: number;
  username: string;
  role: "admin" | "staff";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [view, setView] = useState<
    "actions" | "role-confirm" | "delete-confirm"
  >("actions");

  const newRole = role === "admin" ? "staff" : "admin";
  const updateRoleWithArgs = updateRoleAction.bind(null, adminId, newRole);
  const deleteWithId = deleteStaffAction.bind(null, adminId);

  const [roleState, roleFormAction, isUpdatingRole] = useActionState(
    updateRoleWithArgs,
    initialState,
  );
  const [deleteState, deleteFormAction, isDeleting] = useActionState(
    deleteWithId,
    initialState,
  );

  useEffect(() => {
    if (roleState.success) onOpenChange(false);
  }, [roleState.success, onOpenChange]);

  useEffect(() => {
    if (deleteState.success) onOpenChange(false);
  }, [deleteState.success, onOpenChange]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setView("actions");
      }}
    >
      <DialogContent className="sm:max-w-sm">
        {view === "actions" && (
          <>
            <DialogHeader>
              <DialogTitle>{username}</DialogTitle>
              <DialogDescription className="capitalize">
                Current role: {role}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={() => setView("role-confirm")}>
                {role === "admin" ? "Demote to Staff" : "Promote to Admin"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => setView("delete-confirm")}
              >
                Delete Account
              </Button>
            </div>
          </>
        )}

        {view === "role-confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>
                {role === "admin" ? "Demote" : "Promote"} {username}?
              </DialogTitle>
              <DialogDescription>
                This will change {username}&apos;s role from{" "}
                <span className="capitalize">{role}</span> to{" "}
                <span className="capitalize">{newRole}</span>.
              </DialogDescription>
            </DialogHeader>

            {roleState?.error && (
              <p className="text-sm text-destructive">{roleState.error}</p>
            )}

            <div className="mt-2 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setView("actions")}
                disabled={isUpdatingRole}
              >
                Cancel
              </Button>
              <form action={roleFormAction} className="flex-1">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isUpdatingRole}
                >
                  {isUpdatingRole ? "Updating..." : "Confirm"}
                </Button>
              </form>
            </div>
          </>
        )}

        {view === "delete-confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Delete this account permanently?</DialogTitle>
              <DialogDescription>
                This will permanently delete {username}&apos;s account. This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {deleteState?.error && (
              <p className="text-sm text-destructive">{deleteState.error}</p>
            )}

            <div className="mt-2 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setView("actions")}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <form action={deleteFormAction} className="flex-1">
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </Button>
              </form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
