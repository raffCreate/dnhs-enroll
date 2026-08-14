import { createAdminClient } from "@/lib/supabase/admin";
import { ApplicationsTable } from "./applications-table";

const PAGE_SIZE = 20;

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
    grade?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const query = params.q?.trim() ?? "";
  const status = params.status ?? "";
  const grade = params.grade ?? "";

  const supabase = createAdminClient();

  let request = supabase
    .from("enrollment_applications")
    .select("*, school_years(school_year)", { count: "exact" })
    .order("submitted_at", { ascending: false });

  if (query) {
    request = request.or(
      `first_name.ilike.%${query}%,last_name.ilike.%${query}%`,
    );
  }

  if (status) {
    request = request.eq("status", status);
  }

  if (grade) {
    request = request.eq("grade_level", Number(grade));
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: applications, count } = await request.range(from, to);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Applications
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and approve CSS strand enrollment applications.
        </p>
      </div>
      <ApplicationsTable
        applications={applications ?? []}
        page={page}
        totalCount={count ?? 0}
        pageSize={PAGE_SIZE}
        initialQuery={query}
        initialStatus={status}
        initialGrade={grade}
      />
    </div>
  );
}
