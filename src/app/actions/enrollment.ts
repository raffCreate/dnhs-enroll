"use server";

import { createClient } from "@/lib/supabase/server";

type EnrollState = { error: string; success?: boolean };

export async function submitEnrollmentAction(
  _prevState: EnrollState,
  formData: FormData,
): Promise<EnrollState> {
  const first_name = (formData.get("first_name") as string)?.trim();
  const middle_name = (formData.get("middle_name") as string)?.trim() || null;
  const last_name = (formData.get("last_name") as string)?.trim();
  const suffix = (formData.get("suffix") as string)?.trim() || null;
  const birthdate = formData.get("birthdate") as string;
  const gender = formData.get("gender") as string;
  const contact_number = (formData.get("contact_number") as string)?.trim();
  const email = (formData.get("email") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim();
  const grade_level = Number(formData.get("grade_level"));

  if (
    !first_name ||
    !last_name ||
    !birthdate ||
    !gender ||
    !contact_number ||
    !address ||
    !grade_level
  ) {
    return { error: "Please fill out all required fields." };
  }

  if (gender !== "Male" && gender !== "Female") {
    return { error: "Please select a valid gender." };
  }

  if (grade_level !== 11 && grade_level !== 12) {
    return { error: "Please select a valid grade level." };
  }

  const supabase = await createClient();

  const { data: activeYear, error: yearError } = await supabase
    .from("school_years")
    .select("school_year_id")
    .eq("is_active", true)
    .single();

  if (yearError || !activeYear) {
    return {
      error: "No active school year is set. Please contact the school.",
    };
  }

  const { data: isDuplicate, error: dupError } = await supabase.rpc(
    "is_duplicate_enrollment",
    {
      p_first_name: first_name,
      p_last_name: last_name,
      p_birthdate: birthdate,
      p_school_year_id: activeYear.school_year_id,
    },
  );

  if (dupError) {
    return { error: "Something went wrong. Please try again." };
  }

  if (isDuplicate) {
    return {
      error:
        "An application already exists for this student in the current school year.",
    };
  }

  const { error: insertError } = await supabase
    .from("enrollment_applications")
    .insert({
      first_name,
      middle_name,
      last_name,
      suffix,
      birthdate,
      gender,
      contact_number,
      email,
      address,
      school_year_id: activeYear.school_year_id,
      grade_level,
    });

  if (insertError) {
    return {
      error: "Something went wrong while submitting. Please try again.",
    };
  }

  return { error: "", success: true };
}
