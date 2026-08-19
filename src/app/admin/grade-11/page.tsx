import { createAdminClient } from "@/lib/supabase/admin";
import { StudentsTable } from "./students-table";

const PAGE_SIZE = 10;

export default async function Grade11Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; strand?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const query = params.q?.trim() ?? "";
  const strand = params.strand ?? "";

  const supabase = createAdminClient();

  let request = supabase
    .from("grade_11_students")
    .select("*", { count: "exact" })
    .order("last_name", { ascending: true });

  if (query) {
    request = request.or(
      `first_name.ilike.%${query}%,last_name.ilike.%${query}%,student_number.ilike.%${query}%`,
    );
  }

  if (strand) {
    request = request.eq("strand", strand);
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: students, count } = await request.range(from, to);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Grade 11 Students
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View, update, and archive Grade 11 student records.
        </p>
      </div>
      <StudentsTable
        students={students ?? []}
        page={page}
        totalCount={count ?? 0}
        pageSize={PAGE_SIZE}
        initialQuery={query}
        initialStrand={strand}
      />
    </div>
  );
}
