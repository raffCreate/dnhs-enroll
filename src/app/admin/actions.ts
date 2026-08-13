"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createSession, deleteSession } from "@/lib/session";

type LoginState = { error: string };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  const supabase = createAdminClient();

  const { data: admin, error } = await supabase
    .from("administrators")
    .select("admin_id, username, password_hash, role")
    .eq("username", username)
    .single();

  if (error || !admin) {
    return { error: "Invalid username or password." };
  }

  const passwordMatches = await bcrypt.compare(password, admin.password_hash);

  if (!passwordMatches) {
    return { error: "Invalid username or password." };
  }

  await createSession({
    adminId: admin.admin_id,
    username: admin.username,
    role: admin.role as "admin" | "staff",
  });

  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/");
}
