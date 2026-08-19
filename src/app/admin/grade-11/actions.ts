"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

type ActionState = { error: string; success?: boolean };
type GradeTable = "grade_11_students" | "grade_12_students";

function routeFor(table: GradeTable) {
  return table === "grade_11_students" ? "/admin/grade-11" : "/admin/grade-12";
}

export async function updateStudentAction(
  table: GradeTable,
  studentId: number,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "You must be logged in." };

  const first_name = (formData.get("first_name") as string)?.trim();
  const middle_name = (formData.get("middle_name") as string)?.trim() || null;
  const last_name = (formData.get("last_name") as string)?.trim();
  const suffix = (formData.get("suffix") as string)?.trim() || null;
  const birthdate = formData.get("birthdate") as string;
  const gender = formData.get("gender") as string;
  const contact_number = (formData.get("contact_number") as string)?.trim();
  const email = (formData.get("email") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim();

  const lrn = (formData.get("lrn") as string)?.trim();
  const strand = formData.get("strand") as string;
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

  if (
    !first_name ||
    !last_name ||
    !birthdate ||
    !gender ||
    !contact_number ||
    !address ||
    !lrn ||
    !strand
  ) {
    return { error: "Please fill out all required fields." };
  }

  if (!/^\d{12}$/.test(lrn)) {
    return { error: "LRN must be exactly 12 digits." };
  }

  if (strand !== "CSS" && strand !== "ICT") {
    return { error: "Please select a valid strand." };
  }

  if (is_4ps_member && !household_id) {
    return { error: "Household ID is required for 4Ps members." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from(table)
    .update({
      first_name,
      middle_name,
      last_name,
      suffix,
      birthdate,
      gender,
      contact_number,
      email,
      address,
      lrn,
      strand,
      mother_name,
      mother_contact,
      father_name,
      father_contact,
      height,
      weight,
      is_4ps_member,
      household_id: is_4ps_member ? household_id : null,
    })
    .eq("student_id", studentId);

  if (error) {
    return { error: "Failed to update student. Please try again." };
  }

  revalidatePath(routeFor(table));
  return { error: "", success: true };
}

export async function archiveStudentAction(
  table: GradeTable,
  gradeLevel: 11 | 12,
  studentId: number,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "You must be logged in." };

  const supabase = createAdminClient();

  const { data: student, error: fetchError } = await supabase
    .from(table)
    .select("*")
    .eq("student_id", studentId)
    .single();

  if (fetchError || !student) {
    return { error: "Student not found." };
  }

  const { error: insertError } = await supabase
    .from("archived_students")
    .insert({
      original_student_id: student.student_id,
      grade_level: gradeLevel,
      student_number: student.student_number,
      first_name: student.first_name,
      middle_name: student.middle_name,
      last_name: student.last_name,
      suffix: student.suffix,
      birthdate: student.birthdate,
      gender: student.gender,
      contact_number: student.contact_number,
      email: student.email,
      address: student.address,
      school_year_id: student.school_year_id,
      application_id: student.application_id,
      enrolled_at: student.enrolled_at,
      archived_by: session.adminId,
      lrn: student.lrn,
      strand: student.strand,
      mother_name: student.mother_name,
      mother_contact: student.mother_contact,
      father_name: student.father_name,
      father_contact: student.father_contact,
      height: student.height,
      weight: student.weight,
      is_4ps_member: student.is_4ps_member,
      household_id: student.household_id,
    });

  if (insertError) {
    return { error: "Failed to archive student. Please try again." };
  }

  const { error: deleteError } = await supabase
    .from(table)
    .delete()
    .eq("student_id", studentId);

  if (deleteError) {
    return {
      error:
        "Student was archived but could not be removed from active records.",
    };
  }

  revalidatePath(routeFor(table));
  return { error: "", success: true };
}
