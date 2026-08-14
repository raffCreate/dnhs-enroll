"use client";

import { useState, useActionState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { restoreStudentAction } from "./actions";
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

export function RestoreDialog({
  archiveId,
  studentName,
  gradeLevel,
}: {
  archiveId: number;
  studentName: string;
  gradeLevel: number;
}) {
  const [open, setOpen] = useState(false);
  const restoreWithId = restoreStudentAction.bind(null, archiveId);
  const [state, formAction, isPending] = useActionState(
    restoreWithId,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <RotateCcw className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Restore this student?</DialogTitle>
          <DialogDescription>
            This will move {studentName} back to the active Grade {gradeLevel}{" "}
            student list.
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
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Restoring..." : "Confirm Restore"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
