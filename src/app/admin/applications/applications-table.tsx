// "use client";

// import { useState } from "react";
// import { ApplicationDetailDialog } from "./application-detail-dialog";
// import { Button } from "@/components/ui/button";

// type Application = {
//   application_id: number;
//   first_name: string;
//   middle_name: string | null;
//   last_name: string;
//   suffix: string | null;
//   birthdate: string;
//   gender: string;
//   contact_number: string;
//   email: string | null;
//   address: string;
//   grade_level: number;
//   status: string;
//   submitted_at: string;
//   school_years: { school_year: string } | null;
// };

// export function ApplicationsTable({
//   applications,
// }: {
//   applications: Application[];
// }) {
//   const [selected, setSelected] = useState<Application | null>(null);

//   return (
//     <>
//       <div className="overflow-hidden rounded-lg border border-border bg-background">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
//               <th className="px-4 py-3 font-medium">Name</th>
//               <th className="px-4 py-3 font-medium">Grade Level</th>
//               <th className="px-4 py-3 font-medium">Status</th>
//               <th className="px-4 py-3 font-medium">Submitted</th>
//               <th className="px-4 py-3 font-medium"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {applications.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="px-4 py-8 text-center text-muted-foreground"
//                 >
//                   No applications yet.
//                 </td>
//               </tr>
//             )}
//             {applications.map((app) => (
//               <tr
//                 key={app.application_id}
//                 className="border-b border-border last:border-0"
//               >
//                 <td className="px-4 py-3 text-foreground">
//                   {app.last_name}, {app.first_name} {app.middle_name ?? ""}
//                 </td>
//                 <td className="px-4 py-3 text-foreground">
//                   Grade {app.grade_level}
//                 </td>
//                 <td className="px-4 py-3">
//                   <span
//                     className={
//                       app.status === "approved"
//                         ? "rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
//                         : "rounded-full bg-secondary/20 px-2 py-1 text-xs font-medium text-foreground"
//                     }
//                   >
//                     {app.status === "approved" ? "Approved" : "Pending"}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 text-muted-foreground">
//                   {new Date(app.submitted_at).toLocaleDateString("en-PH", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </td>
//                 <td className="px-4 py-3 text-right">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setSelected(app)}
//                   >
//                     View
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {selected && (
//         <ApplicationDetailDialog
//           application={selected}
//           open={!!selected}
//           onOpenChange={(open) => {
//             if (!open) setSelected(null);
//           }}
//         />
//       )}
//     </>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ApplicationDetailDialog } from "./application-detail-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Application = {
  application_id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;
  birthdate: string;
  gender: string;
  contact_number: string;
  email: string | null;
  address: string;
  grade_level: number;
  strand: string;
  lrn: string;
  mother_name: string | null;
  mother_contact: string | null;
  father_name: string | null;
  father_contact: string | null;
  height: number | null;
  weight: number | null;
  is_4ps_member: boolean;
  household_id: string | null;
  status: string;
  submitted_at: string;
  school_years: { school_year: string } | null;
};

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
];

const gradeOptions = [
  { value: "", label: "All Grades" },
  { value: "11", label: "Grade 11" },
  { value: "12", label: "Grade 12" },
];

export function ApplicationsTable({
  applications,
  page,
  totalCount,
  pageSize,
  initialQuery,
  initialStatus,
  initialGrade,
}: {
  applications: Application[];
  page: number;
  totalCount: number;
  pageSize: number;
  initialQuery: string;
  initialStatus: string;
  initialGrade: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialQuery);
  const [selected, setSelected] = useState<Application | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const updateParams = useCallback(
    (next: { page?: number; q?: string; status?: string; grade?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      const q = next.q ?? initialQuery;
      const status = next.status ?? initialStatus;
      const grade = next.grade ?? initialGrade;
      const nextPage = next.page ?? 1;

      if (q) params.set("q", q);
      else params.delete("q");

      if (status) params.set("status", status);
      else params.delete("status");

      if (grade) params.set("grade", grade);
      else params.delete("grade");

      params.set("page", String(nextPage));
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, initialQuery, initialStatus, initialGrade],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== initialQuery) {
        updateParams({ q: search, page: 1 });
      }
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Input
          placeholder="Search by first name or last name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateParams({ status: opt.value, page: 1 })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  initialStatus === opt.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex gap-1">
            {gradeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateParams({ grade: opt.value, page: 1 })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  initialGrade === opt.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-primary/10 font-bold">
            <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Grade Level</th>
              <th className="px-4 py-3">Status</th>
              <th className="hidden px-4 py-3 md:table-cell">Submitted</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No applications found.
                </td>
              </tr>
            )}
            {applications.map((app) => (
              <tr
                key={app.application_id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3 text-foreground">
                  {app.last_name}, {app.first_name} {app.middle_name ?? ""}
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
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {new Date(app.submitted_at).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelected(app)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages} · {totalCount} total application
          {totalCount === 1 ? "" : "s"}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => updateParams({ page: page - 1 })}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => updateParams({ page: page + 1 })}
          >
            Next
          </Button>
        </div>
      </div>

      {selected && (
        <ApplicationDetailDialog
          application={selected}
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        />
      )}
    </div>
  );
}
