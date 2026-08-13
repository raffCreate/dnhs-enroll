import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RingDivider } from "@/components/layout/ring-divider";
import { createClient } from "@/lib/supabase/server";
import { EnrollmentDialog } from "@/components/enrollment/enrollment-dialog";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: activeYear } = await supabase
    .from("school_years")
    .select("school_year")
    .eq("is_active", true)
    .single();

  const schoolYear = activeYear?.school_year ?? "N/A";
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-125 flex-col justify-center py-12 sm:py-20">
        {/* Clear, unclipped background seal */}
        <div
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <Image
            src="/images/dnhs-logo.png"
            alt=""
            width={700}
            height={700}
            className="h-90 w-90 opacity-20 sm:h-125 sm:w-125 p-3.5"
            priority
          />
        </div>

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            CSS Strand Online Enrollment
          </h1>
          <p className="mt-4 max-w-xl text-balance font-semibold text-sm textforeground sm:text-base">
            Start your enrollment application for the Computer Systems Servicing
            strand at Dimasalang National High School. Apply online, then
            complete the process by submitting your requirements at the school.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <EnrollmentDialog schoolYear={schoolYear} />

            <Button
              size="lg"
              variant="outline"
              className="px-8 font-semibold"
              render={<Link href="/about" />}
              nativeButton={false}
            >
              Learn How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Quick info strip */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-4 py-10 text-center sm:grid-cols-3 sm:px-6">
          <div>
            <p className="font-heading text-2xl font-semibold text-primary">
              Grade 11 &amp; 12
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Senior High School CSS strand applicants
            </p>
          </div>
          <div>
            <p className="font-heading text-2xl font-semibold text-primary">
              No Account Needed
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Apply online without signing up
            </p>
          </div>
          <div>
            <p className="font-heading text-2xl font-semibold text-primary">
              Founded 1952
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Dimasalang National High School
            </p>
          </div>
        </div>
      </section>

      <RingDivider />

      {/* About teaser */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          About the CSS Strand
        </h2>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          The Computer Systems Servicing strand prepares Senior High School
          students with practical skills in computer hardware, networking, and
          systems maintenance. This online system makes it easier to start your
          enrollment application before completing the process in person at the
          school.
        </p>
        <Button
          variant="link"
          className="mt-4 px-0"
          render={<Link href="/about" />}
          nativeButton={false}
        >
          Read the full enrollment guide →
        </Button>
      </section>
    </>
  );
}
