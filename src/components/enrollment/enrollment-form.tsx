"use client";

import { useActionState, useEffect, useState } from "react";
import { submitEnrollmentAction } from "@/app/actions/enrollment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EnrollState = { error: string; success?: boolean };
const initialState: EnrollState = { error: "" };

export function EnrollmentForm({
  schoolYear,
  onSuccess,
}: {
  schoolYear: string;
  onSuccess: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    submitEnrollmentAction,
    initialState,
  );
  const [is4ps, setIs4ps] = useState(false);
  const [lrn, setLrn] = useState("");

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  function fillRandomLrn() {
    const random = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 10),
    ).join("");
    setLrn(random);
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground">
          Personal Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" name="first_name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" name="last_name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="middle_name">Middle Name</Label>
            <Input id="middle_name" name="middle_name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="suffix">Suffix</Label>
            <Input id="suffix" name="suffix" placeholder="Jr., III, etc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthdate">Birthdate</Label>
            <Input id="birthdate" name="birthdate" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              name="gender"
              required
              defaultValue=""
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="lrn">LRN (Learner Reference Number)</Label>
            <div className="flex gap-2">
              <Input
                id="lrn"
                name="lrn"
                required
                value={lrn}
                onChange={(e) => setLrn(e.target.value)}
                maxLength={12}
                placeholder="12-digit LRN"
              />
              <Button type="button" variant="outline" onClick={fillRandomLrn}>
                Fill Test LRN
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              name="height"
              type="number"
              step="0.01"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              step="0.01"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground">
          Parent / Guardian Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mother_name">Mother&apos;s Name</Label>
            <Input id="mother_name" name="mother_name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mother_contact">Mother&apos;s Contact Number</Label>
            <Input id="mother_contact" name="mother_contact" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="father_name">Father&apos;s Name</Label>
            <Input id="father_name" name="father_name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="father_contact">Father&apos;s Contact Number</Label>
            <Input id="father_contact" name="father_contact" />
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
          <Label htmlFor="is_4ps_member" className="cursor-pointer text-sm">
            4Ps (Pantawid Pamilyang Pilipino Program) Member
          </Label>
        </div>

        {is4ps && (
          <div className="space-y-2">
            <Label htmlFor="household_id">Household ID</Label>
            <Input id="household_id" name="household_id" required={is4ps} />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground">
          Contact &amp; Address
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact_number">Contact Number</Label>
            <Input id="contact_number" name="contact_number" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input id="email" name="email" type="email" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" required />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground">
          Enrollment Details
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="strand">Strand</Label>
            <select
              id="strand"
              name="strand"
              required
              defaultValue=""
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="" disabled>
                Select strand
              </option>
              <option value="CSS">Computer Systems Servicing (CSS)</option>
              <option value="ICT">
                Information and Communications Technology (ICT)
              </option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade_level">Grade Level</Label>
            <select
              id="grade_level"
              name="grade_level"
              required
              defaultValue=""
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="" disabled>
                Select grade level
              </option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>School Year</Label>
            <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
              {schoolYear}
            </div>
          </div>
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
