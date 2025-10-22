'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StaffMember = {
  name: string;
  designation: string;
  phone?: string;
};

type StaffCardProps = {
  member: StaffMember;
};

export function StaffCard({ member }: StaffCardProps) {
  const [showPhone, setShowPhone] = useState(false);
  const phoneHref = member.phone ? `tel:${member.phone.replace(/[^+\d]/g, '')}` : undefined;

  return (
    <Card
      className="group relative flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl border border-primary/15 bg-card px-4 py-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
      onMouseEnter={() => setShowPhone(true)}
      onMouseLeave={() => setShowPhone(false)}
    >
      <button
        type="button"
        onClick={() => setShowPhone((prev) => !prev)}
        className="flex w-full flex-col items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-expanded={showPhone}
      >
        <span className="text-base font-semibold text-foreground">{member.name}</span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
          {member.designation}
        </span>
      </button>
      <div
        className={cn(
          'pointer-events-none absolute inset-x-6 bottom-5 flex items-center justify-center gap-3 rounded-full border border-primary/25 bg-gradient-to-r from-primary to-emerald-500 px-4 py-2 text-sm font-semibold text-primary-foreground opacity-0 shadow transition-all duration-300',
          showPhone ? 'pointer-events-auto translate-y-0 opacity-100' : 'translate-y-2'
        )}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
          <Phone className="h-4 w-4" />
        </span>
        {member.phone ? (
          <a
            href={phoneHref}
            className="tracking-wide underline decoration-transparent transition-colors hover:decoration-white"
            onClick={(event) => event.stopPropagation()}
          >
            {member.phone}
          </a>
        ) : (
          <span className="tracking-wide">Phone number to be updated</span>
        )}
      </div>
    </Card>
  );
}
