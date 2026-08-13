import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Welcome back, {session.username}.
      </p>
    </div>
  );
}
