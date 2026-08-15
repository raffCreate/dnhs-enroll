"use client";

import { useActionState, useEffect } from "react";
import { addSchoolYearAction, setActiveSchoolYearAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SchoolYear = {
  school_year_id: number;
  school_year: string;
  is_active: boolean;
  created_at: string;
};

type ActionState = { error: string; success?: boolean };
const initialState: ActionState = { error: "" };

function SetActiveButton({ schoolYearId }: { schoolYearId: number }) {
  const setActiveWithId = setActiveSchoolYearAction.bind(null, schoolYearId);
  const [state, formAction, isPending] = useActionState(
    setActiveWithId,
    initialState,
  );

  return (
    <form action={formAction}>
      <Button type="submit" variant="outline" size="sm" disabled={isPending}>
        {isPending ? "Setting..." : "Set Active"}
      </Button>
      {state?.error && (
        <p className="mt-1 text-xs text-destructive">{state.error}</p>
      )}
    </form>
  );
}

export function SchoolYearsList({
  schoolYears,
}: {
  schoolYears: SchoolYear[];
}) {
  const [state, formAction, isPending] = useActionState(
    addSchoolYearAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      const form = document.getElementById(
        "add-school-year-form",
      ) as HTMLFormElement | null;
      form?.reset();
    }
  }, [state.success]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-background p-4">
        <h2 className="font-heading text-sm font-semibold text-foreground">
          Add New School Year
        </h2>
        <form
          id="add-school-year-form"
          action={formAction}
          className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1 space-y-2">
            <Label htmlFor="school_year">School Year</Label>
            <Input
              id="school_year"
              name="school_year"
              placeholder="2027-2028"
              required
            />
          </div>
          <div className="flex items-center gap-2 pb-2">
            <input
              type="checkbox"
              id="set_active"
              name="set_active"
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="set_active" className="cursor-pointer text-sm">
              Set as active immediately
            </Label>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Adding..." : "Add School Year"}
          </Button>
        </form>
        {state?.error && (
          <p className="mt-3 text-sm text-destructive">{state.error}</p>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-primary/10 font-bold">
            <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3">School Year</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {schoolYears.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No school years yet.
                </td>
              </tr>
            )}
            {schoolYears.map((year) => (
              <tr
                key={year.school_year_id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3 text-foreground">
                  {year.school_year}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      year.is_active
                        ? "rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                        : "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {year.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(year.created_at).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  {!year.is_active && (
                    <SetActiveButton schoolYearId={year.school_year_id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
