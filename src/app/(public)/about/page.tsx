import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
//import { RingDivider } from "@/components/layout/ring-divider";

const steps = [
  {
    title: "Visit the Website",
    description:
      "Go to the enrollment website and read the enrollment information.",
  },
  {
    title: "Read the Guide",
    description:
      "Check the Home and About pages for details on the CSS strand and the enrollment process.",
  },
  {
    title: "Complete the Application",
    description:
      "Click Enroll Now and fill out the online enrollment application form.",
  },
  {
    title: "Submit the Application",
    description:
      "Submit the completed application online. It will be recorded as Pending.",
  },
  {
    title: "Submit Requirements Personally",
    description:
      "Go to Dimasalang National High School and submit the required documents in person.",
  },
  {
    title: "School Reviews Your Requirements",
    description:
      "School staff checks and confirms your submitted documents following the school's process.",
  },
  {
    title: "Application Gets Approved",
    description:
      "Once verified, the administrator approves your application in the system.",
  },
  {
    title: "You're Enrolled",
    description:
      "Your record is automatically placed under Grade 11 or Grade 12, based on your application.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-100 flex-col justify-center py-12 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <Image
            src="/images/dnhs-logo.png"
            alt=""
            width={700}
            height={700}
            className="h-80 w-80 opacity-20 sm:h-100 sm:w-100 p-3.5"
            priority
          />
        </div>

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            About the Enrollment System
          </h1>
          <p className="mt-4 max-w-xl text-balance font-semibold text-sm text-foreground sm:text-base">
            A simple way to start your CSS strand enrollment online, before
            completing the process at Dimasalang National High School.
          </p>
        </div>
      </section>

      {/* System / strand info */}
      {/* <section className="mx-auto max-w-3xl px-4 pb-4 sm:px-6">
        <div className="space-y-4 text-sm text-muted-foreground sm:text-base">
          <p>
            The Online Based Enrolment System for CSS Student makes the initial
            enrollment application for the Computer Systems Servicing (CSS)
            strand more convenient and organized. It is designed for Senior High
            School students applying to{" "}
            <span className="font-medium text-foreground">Grade 11</span> or{" "}
            <span className="font-medium text-foreground">Grade 12</span>.
          </p>
          <p>
            Students can access the enrollment application online without
            creating an account. Submitting the online application does not
            finalize enrollment — you must still submit your required documents
            in person for the school to verify and confirm your enrollment.
          </p>
        </div>
      </section> */}

      {/* <RingDivider /> */}

      {/* Step-by-step guide */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="font-heading text-2xl font-semibold text-foreground text-center">
          Step-by-Step Guide
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          This is a real sequence — follow it in order.
        </p>

        <ol className="mt-8 space-y-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Card className="bg-muted/30">
                <CardContent className="flex gap-4 py-4">
                  <span className="font-heading flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-secondary/50 bg-secondary/15 text-sm font-semibold text-foreground">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground sm:text-base">
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
