import Link from 'next/link';
import { SignOutButton } from '@/components/admin/signout-button.client';

export default function AdminHome() {
  const links = [
    { href: '/admin/news', label: 'News' },
    { href: '/admin/stats', label: 'Quick Stats' },
    { href: '/admin/staff', label: 'Staff' },
    { href: '/admin/projects', label: 'Projects' },
    { href: '/admin/events', label: 'Events' },
    { href: '/admin/about', label: 'About' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <SignOutButton />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-lg border p-4 hover:bg-muted">
            <div className="text-lg font-medium">{l.label}</div>
            <div className="text-sm text-muted-foreground">Manage {l.label.toLowerCase()} content</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
