"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { createAdminClient } from "@/lib/supabase/admin";

type CreateStaffState = { error: string; success?: boolean };

export async function createStaffAction(
  _prevState: CreateStaffState,
  formData: FormData,
): Promise<CreateStaffState> {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return { error: "You are not authorized to perform this action." };
  }

  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (role !== "admin" && role !== "staff") {
    return { error: "Invalid role selected." };
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("administrators")
    .select("admin_id")
    .eq("username", username)
    .maybeSingle();

  if (existing) {
    return { error: "That username is already taken." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { error } = await supabase.from("administrators").insert({
    username,
    password_hash: passwordHash,
    role,
  });

  if (error) {
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath("/admin/staff");
  return { error: "", success: true };
}
