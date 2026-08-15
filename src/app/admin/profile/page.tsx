import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const supabase = createAdminClient();
  const { data: admin } = await supabase
    .from("administrators")
    .select("username, role, created_at")
    .eq("admin_id", session.adminId)
    .single();

  if (!admin) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your account username and password.
        </p>
      </div>
      <ProfileForm
        username={admin.username}
        role={admin.role}
        createdAt={admin.created_at}
      />
    </div>
  );
}
