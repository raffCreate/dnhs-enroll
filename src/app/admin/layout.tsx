import { getSession } from "@/lib/session";
import { Sidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return <div className="min-h-screen bg-muted/20">{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20 md:flex-row">
      <Sidebar role={session.role} />
      <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-8">
        {children}
      </main>
    </div>
  );
}
