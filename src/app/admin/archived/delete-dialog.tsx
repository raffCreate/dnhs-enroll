"use client";

import { useState, useActionState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { deleteArchivedStudentAction } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ActionState = { error: string; success?: boolean };
const initialState: ActionState = { error: "" };

export function DeleteDialog({
  archiveId,
  studentName,
}: {
  archiveId: number;
  studentName: string;
}) {
  const [open, setOpen] = useState(false);
  const deleteWithId = deleteArchivedStudentAction.bind(null, archiveId);
  const [state, formAction, isPending] = useActionState(
    deleteWithId,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>
        <Trash2 className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete this record permanently?</DialogTitle>
          <DialogDescription>
            This will permanently remove {studentName} from the database. This
            action cannot be undone and cannot be restored.
          </DialogDescription>
        </DialogHeader>

        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

        <div className="mt-2 flex gap-3">
          <DialogClose render={<Button variant="outline" className="flex-1" />}>
            Cancel
          </DialogClose>
          <form action={formAction} className="flex-1">
            <Button
              type="submit"
              variant="destructive"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
