import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { isLive } from "@/lib/data";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar live={isLive()} />
      <div className="flex-1 lg:pl-64">
        {!isLive() && (
          <div className="bg-gold/90 px-6 py-2.5 text-center text-xs font-medium text-ink">
            Demo mode — connect Supabase to persist changes. Lists below show
            sample data.
          </div>
        )}
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
