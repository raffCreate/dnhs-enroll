// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { StudentDetailDialog } from "./student-detail-dialog";

// type Student = {
//   student_id: number;
//   student_number: string | null;
//   first_name: string;
//   middle_name: string | null;
//   last_name: string;
//   suffix: string | null;
//   birthdate: string;
//   gender: string;
//   contact_number: string;
//   email: string | null;
//   address: string;
//   strand: string;
//   lrn: string;
//   mother_name: string | null;
//   mother_contact: string | null;
//   father_name: string | null;
//   father_contact: string | null;
//   height: number | null;
//   weight: number | null;
//   is_4ps_member: boolean;
//   household_id: string | null;
// };

// export function StudentsTable({
//   students,
//   page,
//   totalCount,
//   pageSize,
//   initialQuery,
// }: {
//   students: Student[];
//   page: number;
//   totalCount: number;
//   pageSize: number;
//   initialQuery: string;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const [search, setSearch] = useState(initialQuery);
//   const [selected, setSelected] = useState<Student | null>(null);

//   const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

//   const updateParams = useCallback(
//     (nextPage: number, nextQuery: string) => {
//       const params = new URLSearchParams(searchParams.toString());
//       if (nextQuery) {
//         params.set("q", nextQuery);
//       } else {
//         params.delete("q");
//       }
//       params.set("page", String(nextPage));
//       router.push(`${pathname}?${params.toString()}`);
//     },
//     [router, pathname, searchParams],
//   );

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       if (search !== initialQuery) {
//         updateParams(1, search);
//       }
//     }, 300);
//     return () => clearTimeout(timeout);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search]);

//   return (
//     <div className="space-y-4">
//       <Input
//         placeholder="Search by first name, last name, or student number..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="max-w-sm"
//       />

//       <div className="overflow-hidden rounded-lg border border-border bg-background">
//         <table className="w-full text-sm">
//           <thead className="bg-primary/10 font-bold">
//             <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
//               <th className="hidden px-4 py-3 md:table-cell">Student No.</th>
//               <th className="px-4 py-3">Name</th>
//               <th className="hidden px-4 py-3 md:table-cell">Contact</th>
//               <th className="px-4 py-3"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={4}
//                   className="px-4 py-8 text-center text-muted-foreground"
//                 >
//                   No students found.
//                 </td>
//               </tr>
//             )}
//             {students.map((student) => (
//               <tr
//                 key={student.student_id}
//                 className="border-b border-border last:border-0"
//               >
//                 <td className="hidden px-4 py-3 text-foreground md:table-cell">
//                   {student.student_number ?? "—"}
//                 </td>
//                 <td className="px-4 py-3 text-foreground">
//                   {student.last_name}, {student.first_name}{" "}
//                   {student.middle_name ?? ""}
//                 </td>
//                 <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
//                   {student.contact_number}
//                 </td>
//                 <td className="px-4 py-3 text-right">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setSelected(student)}
//                   >
//                     View
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex items-center justify-between">
//         <p className="text-sm text-muted-foreground">
//           Page {page} of {totalPages} · {totalCount} total student
//           {totalCount === 1 ? "" : "s"}
//         </p>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             disabled={page <= 1}
//             onClick={() => updateParams(page - 1, search)}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             disabled={page >= totalPages}
//             onClick={() => updateParams(page + 1, search)}
//           >
//             Next
//           </Button>
//         </div>
//       </div>

//       {selected && (
//         <StudentDetailDialog
//           student={selected}
//           open={!!selected}
//           onOpenChange={(open) => {
//             if (!open) setSelected(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StudentDetailDialog } from "./student-detail-dialog";
import { cn } from "@/lib/utils";

type Student = {
  student_id: number;
  student_number: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;
  birthdate: string;
  gender: string;
  contact_number: string;
  email: string | null;
  address: string;
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
};

export function StudentsTable({
  students,
  page,
  totalCount,
  pageSize,
  initialQuery,
  initialStrand,
}: {
  students: Student[];
  page: number;
  totalCount: number;
  pageSize: number;
  initialQuery: string;
  initialStrand: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialQuery);
  const [selected, setSelected] = useState<Student | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const strandOptions = [
    { value: "", label: "All Strands" },
    { value: "CSS", label: "CSS" },
    { value: "ICT", label: "ICT" },
  ];

  const updateParams = useCallback(
    (next: { page?: number; q?: string; strand?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      const q = next.q ?? initialQuery;
      const strand = next.strand ?? initialStrand;
      const nextPage = next.page ?? 1;

      if (q) params.set("q", q);
      else params.delete("q");

      if (strand) params.set("strand", strand);
      else params.delete("strand");

      params.set("page", String(nextPage));
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, initialQuery, initialStrand],
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
      <Input
        placeholder="Search by first name, last name, or student number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="flex gap-1">
        {strandOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateParams({ strand: opt.value, page: 1 })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              initialStrand === opt.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-primary/10 font-bold">
            <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <th className="hidden px-4 py-3 md:table-cell">Student No.</th>
              <th className="px-4 py-3">Name</th>
              <th className="hidden px-4 py-3 md:table-cell">Contact</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No students found.
                </td>
              </tr>
            )}
            {students.map((student) => (
              <tr
                key={student.student_id}
                className="border-b border-border last:border-0"
              >
                <td className="hidden px-4 py-3 text-foreground md:table-cell">
                  {student.student_number ?? "—"}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {student.last_name}, {student.first_name}{" "}
                  {student.middle_name ?? ""}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {student.contact_number}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelected(student)}
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
          Page {page} of {totalPages} · {totalCount} total student
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
        <StudentDetailDialog
          student={selected}
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        />
      )}
    </div>
  );
}
