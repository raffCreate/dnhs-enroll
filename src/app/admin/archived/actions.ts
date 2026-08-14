"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

type ActionState = { error: string; success?: boolean };

export async function restoreStudentAction(
  archiveId: number,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "You must be logged in." };

  const supabase = createAdminClient();

  const { data: archived, error: fetchError } = await supabase
    .from("archived_students")
    .select("*")
    .eq("archive_id", archiveId)
    .single();

  if (fetchError || !archived) {
    return { error: "Archived record not found." };
  }

  const table =
    archived.grade_level === 11 ? "grade_11_students" : "grade_12_students";

  const { error: insertError } = await supabase.from(table).insert({
    student_number: archived.student_number,
    first_name: archived.first_name,
    middle_name: archived.middle_name,
    last_name: archived.last_name,
    suffix: archived.suffix,
    birthdate: archived.birthdate,
    gender: archived.gender,
    contact_number: archived.contact_number,
    email: archived.email,
    address: archived.address,
    school_year_id: archived.school_year_id,
    application_id: archived.application_id,
    enrolled_at: archived.enrolled_at,
  });

  if (insertError) {
    return {
      error:
        "Failed to restore student. The student number may already be in use.",
    };
  }

  const { error: deleteError } = await supabase
    .from("archived_students")
    .delete()
    .eq("archive_id", archiveId);

  if (deleteError) {
    return {
      error: "Student was restored but could not be removed from archives.",
    };
  }

  revalidatePath("/admin/archived");
  revalidatePath(
    archived.grade_level === 11 ? "/admin/grade-11" : "/admin/grade-12",
  );
  return { error: "", success: true };
}

export async function deleteArchivedStudentAction(
  archiveId: number,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "You must be logged in." };

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("archived_students")
    .delete()
    .eq("archive_id", archiveId);

  if (error) {
    return { error: "Failed to delete record. Please try again." };
  }

  revalidatePath("/admin/archived");
  return { error: "", success: true };
}
