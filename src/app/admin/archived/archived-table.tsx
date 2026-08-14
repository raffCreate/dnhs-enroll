"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RestoreDialog } from "./restore-dialog";
import { DeleteDialog } from "./delete-dialog";

type ArchivedStudent = {
  archive_id: number;
  student_number: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  grade_level: number;
  archived_at: string;
  expires_at: string;
};

export function ArchivedTable({
  students,
  page,
  totalCount,
  pageSize,
  initialQuery,
}: {
  students: ArchivedStudent[];
  page: number;
  totalCount: number;
  pageSize: number;
  initialQuery: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialQuery);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const updateParams = useCallback(
    (nextPage: number, nextQuery: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextQuery) {
        params.set("q", nextQuery);
      } else {
        params.delete("q");
      }
      params.set("page", String(nextPage));
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== initialQuery) {
        updateParams(1, search);
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

      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3 font-medium">Student No.</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Grade</th>
              <th className="px-4 py-3 font-medium">Archived</th>
              <th className="px-4 py-3 font-medium">Expires</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No archived students.
                </td>
              </tr>
            )}
            {students.map((student) => {
              const fullName =
                `${student.first_name} ${student.middle_name ?? ""} ${student.last_name}`
                  .replace(/\s+/g, " ")
                  .trim();
              return (
                <tr
                  key={student.archive_id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-foreground">
                    {student.student_number ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-foreground">{fullName}</td>
                  <td className="px-4 py-3 text-foreground">
                    Grade {student.grade_level}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(student.archived_at).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(student.expires_at).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <RestoreDialog
                        archiveId={student.archive_id}
                        studentName={fullName}
                        gradeLevel={student.grade_level}
                      />
                      <DeleteDialog
                        archiveId={student.archive_id}
                        studentName={fullName}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages} · {totalCount} total archived
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => updateParams(page - 1, search)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => updateParams(page + 1, search)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
