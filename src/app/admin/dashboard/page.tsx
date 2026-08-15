import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

async function getCount(
  supabase: ReturnType<typeof createAdminClient>,
  table: string,
  filters?: (query: any) => any,
) {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (filters) query = filters(query);
  const { count } = await query;
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const supabase = createAdminClient();

  const [
    pendingCount,
    approvedCount,
    grade11Count,
    grade12Count,
    archivedCount,
  ] = await Promise.all([
    getCount(supabase, "enrollment_applications", (q) =>
      q.eq("status", "pending"),
    ),
    getCount(supabase, "enrollment_applications", (q) =>
      q.eq("status", "approved"),
    ),
    getCount(supabase, "grade_11_students"),
    getCount(supabase, "grade_12_students"),
    getCount(supabase, "archived_students"),
  ]);

  const { data: recentApplications } = await supabase
    .from("enrollment_applications")
    .select(
      "application_id, first_name, last_name, grade_level, status, submitted_at",
    )
    .order("submitted_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      label: "Pending Applications",
      value: pendingCount,
      href: "/admin/applications?status=pending",
    },
    {
      label: "Approved Applications",
      value: approvedCount,
      href: "/admin/applications?status=approved",
    },
    {
      label: "Grade 11 Students",
      value: grade11Count,
      href: "/admin/grade-11",
    },
    {
      label: "Grade 12 Students",
      value: grade12Count,
      href: "/admin/grade-12",
    },
    {
      label: "Archived Students",
      value: archivedCount,
      href: "/admin/archived",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back, {session.username}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary hover:bg-accent"
          >
            <p className="font-heading text-2xl font-semibold text-primary">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="font-heading text-sm font-semibold text-foreground">
          Recent Applications
        </h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-border bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Grade Level</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {(!recentApplications || recentApplications.length === 0) && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No applications yet.
                  </td>
                </tr>
              )}
              {recentApplications?.map((app) => (
                <tr
                  key={app.application_id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-foreground">
                    {app.last_name}, {app.first_name}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    Grade {app.grade_level}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        app.status === "approved"
                          ? "rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                          : "rounded-full bg-secondary/20 px-2 py-1 text-xs font-medium text-foreground"
                      }
                    >
                      {app.status === "approved" ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(app.submitted_at).toLocaleDateString("en-PH", {
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
    </div>
  );
}
