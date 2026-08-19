"use client";

import { useActionState, useEffect, useState } from "react";
import { approveApplicationAction, deleteApplicationAction } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Application = {
  application_id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;
  birthdate: string;
  gender: string;
  contact_number: string;
  email: string | null;
  address: string;
  grade_level: number;
  strand: string;
  lrn: string;
  mother_name: string | null;
  mother_contact: string | null;
  father_name: string | null;
  father_contact: string | null;
  height: number | null;
  weight: number | null;
  is_4ps_member: boolean;
  household_id: string | null;
  status: string;
  submitted_at: string;
  school_years: { school_year: string } | null;
};

type ActionState = { error: string; success?: boolean };
const initialState: ActionState = { error: "" };

export function ApplicationDetailDialog({
  application,
  open,
  onOpenChange,
}: {
  application: Application;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [view, setView] = useState<
    "details" | "approve-confirm" | "delete-confirm"
  >("details");

  const approveWithId = approveApplicationAction.bind(
    null,
    application.application_id,
  );
  const deleteWithId = deleteApplicationAction.bind(
    null,
    application.application_id,
  );

  const [approveState, approveFormAction, isApproving] = useActionState(
    approveWithId,
    initialState,
  );
  const [deleteState, deleteFormAction, isDeleting] = useActionState(
    deleteWithId,
    initialState,
  );

  useEffect(() => {
    if (approveState.success) onOpenChange(false);
  }, [approveState.success, onOpenChange]);

  useEffect(() => {
    if (deleteState.success) onOpenChange(false);
  }, [deleteState.success, onOpenChange]);

  const fullName =
    `${application.first_name} ${application.middle_name ?? ""} ${application.last_name} ${application.suffix ?? ""}`
      .replace(/\s+/g, " ")
      .trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        {view === "details" && (
          <>
            <DialogHeader>
              <DialogTitle>{fullName}</DialogTitle>
              <DialogDescription>
                Grade {application.grade_level} · {application.strand} ·{" "}
                {application.school_years?.school_year ?? "N/A"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Personal Information
                </p>
                <div className="mt-2 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">LRN</p>
                    <p className="text-foreground">{application.lrn}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Birthdate</p>
                    <p className="text-foreground">{application.birthdate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="text-foreground">{application.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Height / Weight
                    </p>
                    <p className="text-foreground">
                      {application.height ?? "—"} cm /{" "}
                      {application.weight ?? "—"} kg
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Contact &amp; Address
                </p>
                <div className="mt-2 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Contact Number
                    </p>
                    <p className="text-foreground">
                      {application.contact_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-foreground">
                      {application.email ?? "—"}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-foreground">{application.address}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Parent / Guardian
                </p>
                <div className="mt-2 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Mother&apos;s Name
                    </p>
                    <p className="text-foreground">
                      {application.mother_name ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Mother&apos;s Contact
                    </p>
                    <p className="text-foreground">
                      {application.mother_contact ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Father&apos;s Name
                    </p>
                    <p className="text-foreground">
                      {application.father_name ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Father&apos;s Contact
                    </p>
                    <p className="text-foreground">
                      {application.father_contact ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  4Ps Status
                </p>
                <div className="mt-2 text-sm">
                  <p className="text-foreground">
                    {application.is_4ps_member
                      ? "4Ps Member"
                      : "Not a 4Ps Member"}
                  </p>
                  {application.is_4ps_member && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Household ID: {application.household_id ?? "—"}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="capitalize text-foreground">
                  {application.status}
                </p>
              </div>
            </div>

            {application.status === "pending" && (
              <div className="mt-4 flex gap-3">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setView("delete-confirm")}
                >
                  Delete
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setView("approve-confirm")}
                >
                  Approve
                </Button>
              </div>
            )}
          </>
        )}

        {view === "approve-confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Approve Application?</DialogTitle>
              <DialogDescription>
                This will create a Grade {application.grade_level} student
                record for {fullName}. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {approveState?.error && (
              <p className="text-sm text-destructive">{approveState.error}</p>
            )}

            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setView("details")}
                disabled={isApproving}
              >
                Cancel
              </Button>
              <form action={approveFormAction} className="flex-1">
                <Button type="submit" className="w-full" disabled={isApproving}>
                  {isApproving ? "Approving..." : "Confirm Approve"}
                </Button>
              </form>
            </div>
          </>
        )}

        {view === "delete-confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Delete this application permanently?</DialogTitle>
              <DialogDescription>
                This will permanently delete {fullName}&apos;s application from
                the database. Use this for spam or invalid submissions. This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {deleteState?.error && (
              <p className="text-sm text-destructive">{deleteState.error}</p>
            )}

            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setView("details")}
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
