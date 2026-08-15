"use client";

import { useState } from "react";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { ManageStaffDialog } from "./manage-staff-dialog";

type Admin = {
  admin_id: number;
  username: string;
  role: "admin" | "staff";
  created_at: string;
};

export function StaffTable({
  administrators,
  currentAdminId,
}: {
  administrators: Admin[];
  currentAdminId: number;
}) {
  const [selected, setSelected] = useState<Admin | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3 font-medium">Username</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {administrators.map((admin) => {
              const isSelf = admin.admin_id === currentAdminId;
              return (
                <tr
                  key={admin.admin_id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-foreground">
                    {admin.username}
                    {isSelf && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (You)
                      </span>
                    )}
                  </td>
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
                  <td className="px-4 py-3 text-right">
                    {!isSelf && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelected(admin)}
                      >
                        Manage
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && (
        <ManageStaffDialog
          adminId={selected.admin_id}
          username={selected.username}
          role={selected.role}
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        />
      )}
    </>
  );
}
