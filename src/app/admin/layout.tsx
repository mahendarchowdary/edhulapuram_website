export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { getServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="min-h-[70vh]">
      <div className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="container flex items-center justify-between py-3 text-sm">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded px-2 py-1 hover:bg-muted">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/admin" className="rounded px-2 py-1 hover:bg-muted">Admin</Link>
          </div>
          <div className="text-muted-foreground">Admin Panel</div>
        </div>
      </div>
      <div className="container py-6">
        <div className="flex gap-6">
          <AdminSidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
