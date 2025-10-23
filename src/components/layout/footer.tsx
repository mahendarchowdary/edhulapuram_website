
import Link from "next/link";
import { siteConfig, footerData } from "@/app/content/data";
import { socialIcons } from './social-icons';
import Image from "next/image";
import { headerData } from "@/app/content/data";


export function Footer({ socials }: { socials?: Array<{ name: string; icon: string; url: string }> }) {
  function normalizeHref(raw: string) {
    const t = (raw || "").trim();
    if (!t) return "#";
    if (/^https?:\/\//i.test(t)) return t;
    return `https://${t}`;
  }
  const effectiveSocialsRaw: Array<{ name: string; icon: string; url: string }> = (socials && socials.length > 0 ? socials : siteConfig.socials) as any;
  const desiredOrder = ["Facebook", "Instagram", "Twitter"] as const;
  const effectiveSocials: Array<{ name: string; icon: string; url: string }> = (() => {
    const seen = new Set<string>();
    const out: Array<{ name: string; icon: string; url: string }> = [];
    for (const s of effectiveSocialsRaw) {
      const key = (s.name || "").trim().toLowerCase();
      if (!key) continue;
      if (seen.has(key)) continue;
      const properName = s.name.trim();
      if (!desiredOrder.includes(properName as any)) continue;
      seen.add(key);
      out.push({ ...s, name: properName });
    }
    out.sort((a, b) => desiredOrder.indexOf(a.name as any) - desiredOrder.indexOf(b.name as any));
    return out;
  })();
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-3">
              <Image
                src={headerData.logo.imageUrl}
                alt={headerData.logo.description}
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
                data-ai-hint={headerData.logo.imageHint}
              />
              <div>
                <h2 className="text-lg font-bold">{siteConfig.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Government of Telangana
                </p>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Committed to the development and well-being of Edulapuram's citizens through technology and good governance.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {effectiveSocials.slice(0,3).map((social, idx) => {
                const Icon = socialIcons[social.name as keyof typeof socialIcons];
                const href = normalizeHref(social.url || "");
                const hasUrl = !!(social.url && social.url.trim());
                return hasUrl ? (
                  <a
                    key={`${social.name}-${idx}`}
                    href={href}
                    className="text-muted-foreground hover:text-foreground"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon />
                    <span className="sr-only">{social.name}</span>
                  </a>
                ) : (
                  <span key={`${social.name}-${idx}`} className="text-muted-foreground/60" title={`${social.name} link not set`}>
                    <Icon />
                    <span className="sr-only">{social.name}</span>
                  </span>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Useful Links</h3>
            <ul className="space-y-2">
              {footerData.usefulLinks.map((link) => (
                <li key={link.text}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Related Portals</h3>
            <ul className="space-y-2">
              {footerData.governmentLinks.map((link) => (
                <li key={link.text}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-muted/50">
        <div className="container flex flex-col items-center justify-between gap-2 py-4 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All Rights Reserved.
          </p>
          <p>Last Updated on: {footerData.lastUpdated}</p>
        </div>
      </div>
    </footer>
  );
}
