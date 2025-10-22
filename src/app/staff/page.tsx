import { Metadata } from "next";
import { Phone } from "lucide-react";
import { getStaffMembers } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Staff & Contacts",
  description: "Get in touch with municipal staff for key services and departments.",
};

async function loadStaff() {
  const rows = await getStaffMembers();
  const sorted = rows
    .slice()
    .sort((a, b) => {
      const pa = (a.priority ?? 99);
      const pb = (b.priority ?? 99);
      if (pa !== pb) return pa - pb;
      return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
    });
  return sorted;
}

export default async function StaffPage() {
  const staff = await loadStaff();
  return (
    <main className="py-16">
      <div className="container space-y-12">
        <header className="text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold tracking-[0.24em] text-primary">
            Municipal Team
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Staff & Contacts
          </h1>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            Reach out to the right person for your municipal service needs. Phone numbers will be added shortly.
          </p>
        </header>

        <section className="mx-auto w-full max-w-4xl">
          <ul className="overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-sm">
            {staff.map((member) => {
              const phoneHref = member.phone ? `tel:${member.phone.replace(/[^+\d]/g, "")}` : undefined;

              return (
                <li
                  key={member.name}
                  className="flex flex-col gap-4 px-4 py-5 transition-all duration-200 hover:bg-primary/5 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:px-8"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 hidden h-3 w-3 shrink-0 rounded-full bg-primary sm:block" aria-hidden="true" />
                    <div>
                      <p className="text-lg font-semibold text-foreground">{member.name}</p>
                      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
                        {member.designation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-2 text-sm font-semibold text-foreground sm:justify-end sm:text-base">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Phone className="h-4 w-4" />
                    </span>
                    {member.phone ? (
                      <a href={phoneHref} className="tracking-wide transition-colors hover:text-primary">
                        {member.phone}
                      </a>
                    ) : (
                      <span className="italic text-muted-foreground/80">Phone number to be updated</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
