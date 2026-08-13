"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EnrollmentForm } from "./enrollment-form";

export function EnrollmentDialog({ schoolYear }: { schoolYear: string }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(() => setSubmitted(false), 200);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="lg" className="px-8" />}>
        Enroll Now
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        {submitted ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">
              Application Submitted
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your enrollment application has been recorded as{" "}
              <span className="font-medium text-foreground">Pending</span>.
            </p>
            <div className="mt-4 rounded-md border border-secondary/40 bg-secondary/10 p-3 text-sm text-foreground">
              This does not finalize your enrollment. Please visit Dimasalang
              National High School in person to submit your required documents
              and complete the enrollment process.
            </div>
            <Button className="mt-6" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>CSS Strand Enrollment Application</DialogTitle>
              <DialogDescription>
                Fill out the form below to start your application.
              </DialogDescription>
            </DialogHeader>
            <EnrollmentForm
              schoolYear={schoolYear}
              onSuccess={() => setSubmitted(true)}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
