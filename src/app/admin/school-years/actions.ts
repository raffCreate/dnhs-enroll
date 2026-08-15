"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

type ActionState = { error: string; success?: boolean };

function isValidSchoolYear(value: string) {
  const match = value.match(/^(\d{4})-(\d{4})$/);
  if (!match) return false;
  const [, start, end] = match;
  return Number(end) === Number(start) + 1;
}

export async function addSchoolYearAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "You must be logged in." };

  const school_year = (formData.get("school_year") as string)?.trim();
  const setActive = formData.get("set_active") === "on";

  if (!school_year) {
    return { error: "School year is required." };
  }

  if (!isValidSchoolYear(school_year)) {
    return { error: 'Use the format "2026-2027" with consecutive years.' };
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("school_years")
    .select("school_year_id")
    .eq("school_year", school_year)
    .maybeSingle();

  if (existing) {
    return { error: "That school year already exists." };
  }

  if (setActive) {
    await supabase
      .from("school_years")
      .update({ is_active: false })
      .eq("is_active", true);
  }

  const { error } = await supabase.from("school_years").insert({
    school_year,
    is_active: setActive,
  });

  if (error) {
    return { error: "Failed to add school year. Please try again." };
  }

  revalidatePath("/admin/school-years");
  return { error: "", success: true };
}

export async function setActiveSchoolYearAction(
  schoolYearId: number,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "You must be logged in." };

  const supabase = createAdminClient();

  await supabase
    .from("school_years")
    .update({ is_active: false })
    .eq("is_active", true);

  const { error } = await supabase
    .from("school_years")
    .update({ is_active: true })
    .eq("school_year_id", schoolYearId);

  if (error) {
    return { error: "Failed to set active school year. Please try again." };
  }

  revalidatePath("/admin/school-years");
  return { error: "", success: true };
}
