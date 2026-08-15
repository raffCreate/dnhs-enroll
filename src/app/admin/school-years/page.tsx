import { createAdminClient } from "@/lib/supabase/admin";
import { SchoolYearsList } from "./school-years-list";

export default async function SchoolYearsPage() {
  const supabase = createAdminClient();
  const { data: schoolYears } = await supabase
    .from("school_years")
    .select("*")
    .order("school_year", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          School Years
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage school years. Only one year can be active at a time — the
          active year is used automatically on the public enrollment form.
        </p>
      </div>
      <SchoolYearsList schoolYears={schoolYears ?? []} />
    </div>
  );
}
