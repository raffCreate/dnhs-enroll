"use server";

import bcrypt from "bcryptjs";
import { getSession, createSession } from "@/lib/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

type ActionState = { error: string; success?: boolean };

export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "You must be logged in." };

  const username = (formData.get("username") as string)?.trim();
  const password = (formData.get("password") as string) || "";

  if (!username) {
    return { error: "Username is required." };
  }

  if (password && password.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }

  const supabase = createAdminClient();

  if (username !== session.username) {
    const { data: existing } = await supabase
      .from("administrators")
      .select("admin_id")
      .eq("username", username)
      .neq("admin_id", session.adminId)
      .maybeSingle();

    if (existing) {
      return { error: "That username is already taken." };
    }
  }

  const updates: { username: string; password_hash?: string } = { username };

  if (password) {
    updates.password_hash = await bcrypt.hash(password, 10);
  }

  const { error } = await supabase
    .from("administrators")
    .update(updates)
    .eq("admin_id", session.adminId);

  if (error) {
    return { error: "Failed to update profile. Please try again." };
  }

  // Refresh the session cookie so the header/sidebar reflect the new username
  await createSession({
    adminId: session.adminId,
    username,
    role: session.role,
  });

  revalidatePath("/admin/profile");
  return { error: "", success: true };
}
