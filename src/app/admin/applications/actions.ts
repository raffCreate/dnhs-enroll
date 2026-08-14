"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

type ApproveState = { error: string; success?: boolean };

function getYearPrefix(schoolYear: string) {
  const startYear = schoolYear.split("-")[0];
  return startYear.slice(-2);
}

export async function approveApplicationAction(
  applicationId: number,
  _prevState: ApproveState,
  _formData: FormData,
): Promise<ApproveState> {
  const session = await getSession();
  if (!session) {
    return { error: "You must be logged in." };
  }

  const supabase = createAdminClient();

  const { data: application, error: appError } = await supabase
    .from("enrollment_applications")
    .select("*, school_years(school_year)")
    .eq("application_id", applicationId)
    .single();

  if (appError || !application) {
    return { error: "Application not found." };
  }

  if (application.status === "approved") {
    return { error: "This application has already been approved." };
  }

  const gradeLevel = application.grade_level;
  const tableName =
    gradeLevel === 11 ? "grade_11_students" : "grade_12_students";

  const { count } = await supabase
    .from(tableName)
    .select("*", { count: "exact", head: true })
    .eq("school_year_id", application.school_year_id);

  const yearPrefix = getYearPrefix(application.school_years.school_year);
  const sequence = String((count ?? 0) + 1).padStart(4, "0");
  const studentNumber = `${yearPrefix}${gradeLevel}${sequence}`;

  const { error: insertError } = await supabase.from(tableName).insert({
    student_number: studentNumber,
    first_name: application.first_name,
    middle_name: application.middle_name,
    last_name: application.last_name,
    suffix: application.suffix,
    birthdate: application.birthdate,
    gender: application.gender,
    contact_number: application.contact_number,
    email: application.email,
    address: application.address,
    school_year_id: application.school_year_id,
    application_id: application.application_id,
  });

  if (insertError) {
    return { error: "Failed to create student record. Please try again." };
  }

  const { error: updateError } = await supabase
    .from("enrollment_applications")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: session.adminId,
    })
    .eq("application_id", applicationId);

  if (updateError) {
    return {
      error:
        "Student record was created, but updating the application status failed.",
    };
  }

  revalidatePath("/admin/applications");
  return { error: "", success: true };
}

export async function deleteApplicationAction(
  applicationId: number,
  _prevState: ApproveState,
  _formData: FormData,
): Promise<ApproveState> {
  const session = await getSession();
  if (!session) return { error: "You must be logged in." };

  const supabase = createAdminClient();

  const { data: application } = await supabase
    .from("enrollment_applications")
    .select("status")
    .eq("application_id", applicationId)
    .single();

  if (!application) {
    return { error: "Application not found." };
  }

  if (application.status !== "pending") {
    return { error: "Only pending applications can be deleted." };
  }

  const { error } = await supabase
    .from("enrollment_applications")
    .delete()
    .eq("application_id", applicationId);

  if (error) {
    return { error: "Failed to delete application. Please try again." };
  }

  revalidatePath("/admin/applications");
  return { error: "", success: true };
}
