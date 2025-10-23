import { getServerSupabaseClient, getServiceSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function fetchStaff() {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase
    .from("staff_members")
    .select("id,name,designation,phone,priority,updated_at")
    .order("priority", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export default async function AdminStaffPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const items = await fetchStaff();
  const sp = await searchParams;
  const successMsg = sp?.success ? decodeURIComponent(sp.success) : undefined;

  async function createMember(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "").trim();
    const designation = String(formData.get("designation") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim() || null;
    const priorityStr = String(formData.get("priority") ?? "99").trim();
    const priority = Number(priorityStr || "99");
    if (!name || !designation) return;
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("staff_members").insert({ name, designation, phone, priority });
    revalidatePath("/admin/staff");
    revalidatePath("/");
    revalidatePath("/staff");
    redirect("/admin/staff?success=Member%20created");
  }

  async function del(id: string) {
    "use server";
    const supabase = getServiceSupabaseClient({ useServiceRole: true });
    await supabase.from("staff_members").delete().eq("id", id);
    revalidatePath("/admin/staff");
    revalidatePath("/");
    revalidatePath("/staff");
    redirect("/admin/staff?success=Member%20deleted");
  }

  return (
    <div className="space-y-6">
      {successMsg ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMsg}</div>
      ) : null}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Staff</h1>
        <span className="text-sm text-muted-foreground">{items.length} members</span>
      </div>

      <form action={createMember} className="rounded border p-4 space-y-3">
        <div className="text-sm font-medium">Create Staff Member</div>
        <div className="grid gap-3 sm:grid-cols-4">
          <input name="name" placeholder="Name" className="rounded border px-3 py-2" required />
          <input name="designation" placeholder="Designation" className="rounded border px-3 py-2" required />
          <input name="phone" placeholder="Phone" className="rounded border px-3 py-2" />
          <input name="priority" placeholder="Priority (lower = higher)" className="rounded border px-3 py-2" defaultValue="99" />
        </div>
        <button type="submit" className="rounded bg-primary px-4 py-2 text-white">Create</button>
      </form>

      <div className="overflow-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Designation</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Updated</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n) => (
              <tr key={n.id} className="border-t">
                <td className="px-3 py-2 whitespace-nowrap">{n.priority ?? 99}</td>
                <td className="px-3 py-2">{n.name}</td>
                <td className="px-3 py-2">{n.designation}</td>
                <td className="px-3 py-2">{n.phone ?? ""}</td>
                <td className="px-3 py-2">{n.updated_at ? new Date(n.updated_at as unknown as string).toLocaleString() : ""}</td>
                <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                  <form action={del.bind(null, n.id as string)} className="inline">
                    <button className="rounded border px-2 py-1">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
