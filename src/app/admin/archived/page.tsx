import { createAdminClient } from "@/lib/supabase/admin";
import { ArchivedTable } from "./archived-table";

const PAGE_SIZE = 10;

export default async function ArchivedPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const query = params.q?.trim() ?? "";

  const supabase = createAdminClient();

  let request = supabase
    .from("archived_students")
    .select("*", { count: "exact" })
    .order("archived_at", { ascending: false });

  if (query) {
    request = request.or(
      `first_name.ilike.%${query}%,last_name.ilike.%${query}%,student_number.ilike.%${query}%`,
    );
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: students, count } = await request.range(from, to);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Archived Students
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Restore archived students back to their grade level, or wait for
          automatic expiry.
        </p>
      </div>
      <ArchivedTable
        students={students ?? []}
        page={page}
        totalCount={count ?? 0}
        pageSize={PAGE_SIZE}
        initialQuery={query}
      />
    </div>
  );
}
