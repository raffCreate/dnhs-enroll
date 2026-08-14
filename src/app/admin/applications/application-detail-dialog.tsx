"use client";

import { useActionState, useEffect, useState } from "react";
import { approveApplicationAction, deleteApplicationAction } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  status: string;
  submitted_at: string;
  school_years: { school_year: string } | null;
};

type ActionState = { error: string; success?: boolean };
const initialState: ActionState = { error: "" };

export function ApplicationDetailDialog({
  application,
  open,
  onOpenChange,
}: {
  application: Application;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [view, setView] = useState<
    "details" | "approve-confirm" | "delete-confirm"
  >("details");

  const approveWithId = approveApplicationAction.bind(
    null,
    application.application_id,
  );
  const deleteWithId = deleteApplicationAction.bind(
    null,
    application.application_id,
  );

  const [approveState, approveFormAction, isApproving] = useActionState(
    approveWithId,
    initialState,
  );
  const [deleteState, deleteFormAction, isDeleting] = useActionState(
    deleteWithId,
    initialState,
  );

  useEffect(() => {
    if (approveState.success) onOpenChange(false);
  }, [approveState.success, onOpenChange]);

  useEffect(() => {
    if (deleteState.success) onOpenChange(false);
  }, [deleteState.success, onOpenChange]);

  const fullName =
    `${application.first_name} ${application.middle_name ?? ""} ${application.last_name} ${application.suffix ?? ""}`
      .replace(/\s+/g, " ")
      .trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        {view === "details" && (
          <>
            <DialogHeader>
              <DialogTitle>{fullName}</DialogTitle>
              <DialogDescription>
                Grade {application.grade_level} ·{" "}
                {application.school_years?.school_year ?? "N/A"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Birthdate</p>
                <p className="text-foreground">{application.birthdate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Gender</p>
                <p className="text-foreground">{application.gender}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contact Number</p>
                <p className="text-foreground">{application.contact_number}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-foreground">{application.email ?? "—"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-foreground">{application.address}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="capitalize text-foreground">
                  {application.status}
                </p>
              </div>
            </div>

            {application.status === "pending" && (
              <div className="mt-4 flex gap-3">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setView("delete-confirm")}
                >
                  Delete
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setView("approve-confirm")}
                >
                  Approve
                </Button>
              </div>
            )}
          </>
        )}

        {view === "approve-confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Approve Application?</DialogTitle>
              <DialogDescription>
                This will create a Grade {application.grade_level} student
                record for {fullName}. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {approveState?.error && (
              <p className="text-sm text-destructive">{approveState.error}</p>
            )}

            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setView("details")}
                disabled={isApproving}
              >
                Cancel
              </Button>
              <form action={approveFormAction} className="flex-1">
                <Button type="submit" className="w-full" disabled={isApproving}>
                  {isApproving ? "Approving..." : "Confirm Approve"}
                </Button>
              </form>
            </div>
          </>
        )}

        {view === "delete-confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Delete this application permanently?</DialogTitle>
              <DialogDescription>
                This will permanently delete {fullName}&apos;s application from
                the database. Use this for spam or invalid submissions. This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {deleteState?.error && (
              <p className="text-sm text-destructive">{deleteState.error}</p>
            )}

            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setView("details")}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <form action={deleteFormAction} className="flex-1">
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </Button>
              </form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// "use client";

// import { useActionState, useEffect, useState } from "react";
// import { approveApplicationAction } from "./actions";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
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

// type ApproveState = { error: string; success?: boolean };
// const initialState: ApproveState = { error: "" };

// export function ApplicationDetailDialog({
//   application,
//   open,
//   onOpenChange,
// }: {
//   application: Application;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }) {
//   const [view, setView] = useState<"details" | "confirm">("details");

//   const approveWithId = approveApplicationAction.bind(
//     null,
//     application.application_id,
//   );
//   const [state, formAction, isPending] = useActionState(
//     approveWithId,
//     initialState,
//   );

//   useEffect(() => {
//     if (state.success) {
//       onOpenChange(false);
//     }
//   }, [state.success, onOpenChange]);

//   const fullName =
//     `${application.first_name} ${application.middle_name ?? ""} ${application.last_name} ${application.suffix ?? ""}`
//       .replace(/\s+/g, " ")
//       .trim();

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
//         {view === "details" ? (
//           <>
//             <DialogHeader>
//               <DialogTitle>{fullName}</DialogTitle>
//               <DialogDescription>
//                 Grade {application.grade_level} ·{" "}
//                 {application.school_years?.school_year ?? "N/A"}
//               </DialogDescription>
//             </DialogHeader>

//             <div className="grid gap-3 text-sm sm:grid-cols-2">
//               <div>
//                 <p className="text-xs text-muted-foreground">Birthdate</p>
//                 <p className="text-foreground">{application.birthdate}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-muted-foreground">Gender</p>
//                 <p className="text-foreground">{application.gender}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-muted-foreground">Contact Number</p>
//                 <p className="text-foreground">{application.contact_number}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-muted-foreground">Email</p>
//                 <p className="text-foreground">{application.email ?? "—"}</p>
//               </div>
//               <div className="sm:col-span-2">
//                 <p className="text-xs text-muted-foreground">Address</p>
//                 <p className="text-foreground">{application.address}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-muted-foreground">Status</p>
//                 <p className="capitalize text-foreground">
//                   {application.status}
//                 </p>
//               </div>
//             </div>

//             {application.status === "pending" && (
//               <Button
//                 className="mt-4 w-full"
//                 onClick={() => setView("confirm")}
//               >
//                 Approve Application
//               </Button>
//             )}
//           </>
//         ) : (
//           <>
//             <DialogHeader>
//               <DialogTitle>Approve Application?</DialogTitle>
//               <DialogDescription>
//                 This will create a Grade {application.grade_level} student
//                 record for {fullName}. This action cannot be undone.
//               </DialogDescription>
//             </DialogHeader>

//             {state?.error && (
//               <p className="text-sm text-destructive">{state.error}</p>
//             )}

//             <div className="mt-4 flex gap-3">
//               <Button
//                 variant="outline"
//                 className="flex-1"
//                 onClick={() => setView("details")}
//                 disabled={isPending}
//               >
//                 Cancel
//               </Button>
//               <form action={formAction} className="flex-1">
//                 <Button type="submit" className="w-full" disabled={isPending}>
//                   {isPending ? "Approving..." : "Confirm Approve"}
//                 </Button>
//               </form>
//             </div>
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }
