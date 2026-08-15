import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { AddStaffForm } from "./add-staff-form";
import { StaffTable } from "./staff-table";

export default async function StaffPage() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/admin/dashboard");
  }

  const supabase = createAdminClient();
  const { data: administrators } = await supabase
    .from("administrators")
    .select("admin_id, username, role, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Manage Staff
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add, promote, or remove staff and admin accounts.
        </p>
      </div>

      <AddStaffForm />

      <StaffTable
        administrators={administrators ?? []}
        currentAdminId={session.adminId}
      />
    </div>
  );
}
