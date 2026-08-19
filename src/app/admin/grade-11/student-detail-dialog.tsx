"use client";

import { useActionState, useEffect, useState } from "react";
import { updateStudentAction, archiveStudentAction } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Student = {
  student_id: number;
  student_number: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;
  birthdate: string;
  gender: string;
  contact_number: string;
  email: string | null;
  address: string;
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
};

type ActionState = { error: string; success?: boolean };
const initialState: ActionState = { error: "" };

export function StudentDetailDialog({
  student,
  open,
  onOpenChange,
}: {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [view, setView] = useState<"details" | "edit" | "archive-confirm">(
    "details",
  );
  const [is4ps, setIs4ps] = useState(student.is_4ps_member);

  const updateWithIds = updateStudentAction.bind(
    null,
    "grade_11_students",
    student.student_id,
  );
  const archiveWithIds = archiveStudentAction.bind(
    null,
    "grade_11_students",
    11,
    student.student_id,
  );

  const [updateState, updateFormAction, isUpdating] = useActionState(
    updateWithIds,
    initialState,
  );
  const [archiveState, archiveFormAction, isArchiving] = useActionState(
    archiveWithIds,
    initialState,
  );

  useEffect(() => {
    if (updateState.success) setView("details");
  }, [updateState.success]);

  useEffect(() => {
    if (archiveState.success) onOpenChange(false);
  }, [archiveState.success, onOpenChange]);

  const fullName =
    `${student.first_name} ${student.middle_name ?? ""} ${student.last_name} ${student.suffix ?? ""}`
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
                Student No. {student.student_number ?? "—"} · {student.strand}
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
                    <p className="text-foreground">{student.lrn}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Birthdate</p>
                    <p className="text-foreground">{student.birthdate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="text-foreground">{student.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Height / Weight
                    </p>
                    <p className="text-foreground">
                      {student.height ?? "—"} cm / {student.weight ?? "—"} kg
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
                    <p className="text-foreground">{student.contact_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-foreground">{student.email ?? "—"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-foreground">{student.address}</p>
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
                      {student.mother_name ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Mother&apos;s Contact
                    </p>
                    <p className="text-foreground">
                      {student.mother_contact ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Father&apos;s Name
                    </p>
                    <p className="text-foreground">
                      {student.father_name ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Father&apos;s Contact
                    </p>
                    <p className="text-foreground">
                      {student.father_contact ?? "—"}
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
                    {student.is_4ps_member ? "4Ps Member" : "Not a 4Ps Member"}
                  </p>
                  {student.is_4ps_member && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Household ID: {student.household_id ?? "—"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setView("edit")}
              >
                Update
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setView("archive-confirm")}
              >
                Delete (Archive)
              </Button>
            </div>
          </>
        )}

        {view === "edit" && (
          <>
            <DialogHeader>
              <DialogTitle>Update Student Record</DialogTitle>
              <DialogDescription>
                Student No. {student.student_number ?? "—"}
              </DialogDescription>
            </DialogHeader>

            <form action={updateFormAction} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    defaultValue={student.first_name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    defaultValue={student.last_name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middle_name">Middle Name</Label>
                  <Input
                    id="middle_name"
                    name="middle_name"
                    defaultValue={student.middle_name ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suffix">Suffix</Label>
                  <Input
                    id="suffix"
                    name="suffix"
                    defaultValue={student.suffix ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthdate">Birthdate</Label>
                  <Input
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    defaultValue={student.birthdate}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    defaultValue={student.gender}
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="lrn">LRN</Label>
                  <Input
                    id="lrn"
                    name="lrn"
                    defaultValue={student.lrn}
                    maxLength={12}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="strand">Strand</Label>
                  <select
                    id="strand"
                    name="strand"
                    defaultValue={student.strand}
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                  >
                    <option value="CSS">CSS</option>
                    <option value="ICT">ICT</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_number">Contact Number</Label>
                  <Input
                    id="contact_number"
                    name="contact_number"
                    defaultValue={student.contact_number}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={student.email ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    step="0.01"
                    defaultValue={student.height ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.01"
                    defaultValue={student.weight ?? ""}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={student.address}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mother_name">Mother&apos;s Name</Label>
                  <Input
                    id="mother_name"
                    name="mother_name"
                    defaultValue={student.mother_name ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mother_contact">Mother&apos;s Contact</Label>
                  <Input
                    id="mother_contact"
                    name="mother_contact"
                    defaultValue={student.mother_contact ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="father_name">Father&apos;s Name</Label>
                  <Input
                    id="father_name"
                    name="father_name"
                    defaultValue={student.father_name ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="father_contact">Father&apos;s Contact</Label>
                  <Input
                    id="father_contact"
                    name="father_contact"
                    defaultValue={student.father_contact ?? ""}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_4ps_member"
                  name="is_4ps_member"
                  checked={is4ps}
                  onChange={(e) => setIs4ps(e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                <Label
                  htmlFor="is_4ps_member"
                  className="cursor-pointer text-sm"
                >
                  4Ps Member
                </Label>
              </div>

              {is4ps && (
                <div className="space-y-2">
                  <Label htmlFor="household_id">Household ID</Label>
                  <Input
                    id="household_id"
                    name="household_id"
                    defaultValue={student.household_id ?? ""}
                    required={is4ps}
                  />
                </div>
              )}

              {updateState?.error && (
                <p className="text-sm text-destructive">{updateState.error}</p>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setView("details")}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </>
        )}

        {view === "archive-confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Archive this student?</DialogTitle>
              <DialogDescription>
                This will move {fullName} to Archived Students and remove them
                from the active Grade 11 list. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {archiveState?.error && (
              <p className="text-sm text-destructive">{archiveState.error}</p>
            )}

            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setView("details")}
                disabled={isArchiving}
              >
                Cancel
              </Button>
              <form action={archiveFormAction} className="flex-1">
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full"
                  disabled={isArchiving}
                >
                  {isArchiving ? "Archiving..." : "Confirm Archive"}
                </Button>
              </form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
