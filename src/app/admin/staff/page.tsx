import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { AddStaffForm } from "./add-staff-form";

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
          Add and view staff and admin accounts.
        </p>
      </div>

      <AddStaffForm />

      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3 font-medium">Username</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {administrators?.map((admin) => (
              <tr
                key={admin.admin_id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3 text-foreground">{admin.username}</td>
                <td className="px-4 py-3 capitalize text-foreground">
                  {admin.role}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(admin.created_at).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
