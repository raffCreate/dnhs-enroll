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
  const strand = formData.get("strand") as string;

  const lrn = (formData.get("lrn") as string)?.trim();

  const mother_name = (formData.get("mother_name") as string)?.trim() || null;
  const mother_contact =
    (formData.get("mother_contact") as string)?.trim() || null;
  const father_name = (formData.get("father_name") as string)?.trim() || null;
  const father_contact =
    (formData.get("father_contact") as string)?.trim() || null;

  const heightRaw = formData.get("height") as string;
  const weightRaw = formData.get("weight") as string;
  const height = heightRaw ? Number(heightRaw) : null;
  const weight = weightRaw ? Number(weightRaw) : null;

  const is_4ps_member = formData.get("is_4ps_member") === "on";
  const household_id = (formData.get("household_id") as string)?.trim() || null;

  // Required field checks
  if (
    !first_name ||
    !last_name ||
    !birthdate ||
    !gender ||
    !contact_number ||
    !address ||
    !grade_level ||
    !strand ||
    !lrn
  ) {
    return { error: "Please fill out all required fields." };
  }

  if (gender !== "Male" && gender !== "Female") {
    return { error: "Please select a valid gender." };
  }

  if (grade_level !== 11 && grade_level !== 12) {
    return { error: "Please select a valid grade level." };
  }

  if (strand !== "CSS" && strand !== "ICT") {
    return { error: "Please select a valid strand." };
  }

  if (!/^\d{12}$/.test(lrn)) {
    return { error: "LRN must be exactly 12 digits." };
  }

  if (is_4ps_member && !household_id) {
    return { error: "Household ID is required for 4Ps members." };
  }

  if (heightRaw && (isNaN(height as number) || (height as number) <= 0)) {
    return { error: "Please enter a valid height." };
  }

  if (weightRaw && (isNaN(weight as number) || (weight as number) <= 0)) {
    return { error: "Please enter a valid weight." };
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

  const { data: existingApplication, error: dupError } = await supabase
    .from("enrollment_applications")
    .select("application_id")
    .ilike("first_name", first_name)
    .ilike("last_name", last_name)
    .eq("birthdate", birthdate)
    .eq("school_year_id", activeYear.school_year_id)
    .maybeSingle();

  if (dupError) {
    return { error: "Something went wrong. Please try again." };
  }

  if (existingApplication) {
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
      strand,
      lrn,
      mother_name,
      mother_contact,
      father_name,
      father_contact,
      height,
      weight,
      is_4ps_member,
      household_id: is_4ps_member ? household_id : null,
    });

  if (insertError) {
    return {
      error: "Something went wrong while submitting. Please try again.",
    };
  }

  return { error: "", success: true };
}
