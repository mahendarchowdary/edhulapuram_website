
import { Home } from "lucide-react";
import type { MetadataRoute } from "next";

export type NavItem = {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
  icon?: any;
  children?: NavItem[];
};

export const sitemap: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Citizen Services",
    description: "Essential Citizen Services – Telangana Municipality",
    children: [
      {
        title: "Property-Related",
        description: "Manage property taxes, assessments, and ownership records.",
        children: [
          { title: "Property Tax", href: "https://emunicipal.telangana.gov.in/ptpayment", external: true, description: "Pay your property tax online." },
          { title: "Property Assessment", href: "https://emunicipal.telangana.gov.in/ptassessment", external: true, description: "Get your property assessed for tax purposes." },
          { title: "Vacant Land Tax", href: "https://emunicipal.telangana.gov.in/", external: true, description: "Pay taxes for vacant land." },
          { title: "Mutation (Ownership Transfer)", href: "https://emunicipal.telangana.gov.in/mutation", external: true, description: "Apply for transfer of property ownership." },
          { title: "Tax Payment Status / Receipt", href: "https://cdma.cgg.gov.in/CDMA_ARBS/General/CheckPaymentStatus", external: true, description: "Check your payment status or download a receipt." },
        ],
      },
      {
        title: "Water Supply",
        description: "Services for new water connections, bill payments, and status checks.",
        children: [
           { title: "New Water Connection", href: "https://emunicipal.telangana.gov.in/waterconnection", external: true, description: "Apply for a new water tap connection." },
           { title: "Connection Renewal / Mutation", href: "https://emunicipal.telangana.gov.in/", external: true, description: "Renew or transfer your water connection." },
           { title: "Bill Payment", href: "https://emunicipal.telangana.gov.in/waterpayment", external: true, description: "Pay your water bills online." },
           { title: "Check Connection Status", href: "https://cdma.cgg.gov.in/CDMA_ARBS/General/CheckPaymentStatus", external: true, description: "Track the status of your application." },
        ],
      },
      {
        title: "Trade & Business",
        description: "Licensing and permits for businesses and trades.",
        children: [
          { title: "New Trade License", href: "https://emunicipal.telangana.gov.in/tradelicense", external: true, description: "Apply for a new trade license." },
          { title: "Renewal of Trade License", href: "https://emunicipal.telangana.gov.in/tradelicense/renewal", external: true, description: "Renew your existing trade license." },
          { title: "Trade Fee Payment", href: "https://emunicipal.telangana.gov.in/tlpayment", external: true, description: "Pay your annual trade license fees." },
        ]
      },
       {
        title: "Advertisement & Signage",
        description: "Permissions for hoardings, banners, and other advertisements.",
        children: [
          { title: "Advertisement Permission", href: "https://emunicipal.telangana.gov.in/advertisement", external: true, description: "Apply for a new advertisement license." },
        ],
      },
      {
        title: "Building Permissions",
        description: "All approvals related to building and construction.",
        children: [
          { title: "Apply for Building Permission", href: "https://tgbpass.telangana.gov.in/", external: true, description: "Submit plans for building and layout approvals." },
          { title: "Check Permission Status", href: "https://tgbpass.telangana.gov.in/", external: true, description: "Track the status of your application." },
          { title: "Road Cutting Permission", href: "https://emunicipal.telangana.gov.in/roadcutting", external: true, description: "Get permission for road cutting for utilities." },
        ]
      },
      {
        title: "Certificates & Records",
        description: "Apply for and verify official certificates.",
        children: [
           { title: "Birth Certificate", href: "https://emunicipal.telangana.gov.in/birthcertificate", external: true, description: "Apply for a birth certificate." },
           { title: "Death Certificate", href: "https://emunicipal.telangana.gov.in/deathcertificate", external: true, description: "Apply for a death certificate." },
        ]
      },
       {
        title: "Sanitation & Public Health",
        description: "Report issues related to sanitation and public health.",
        children: [
           { title: "Garbage / Sanitation Complaint", href: "https://emunicipal.telangana.gov.in/sanitation", external: true, description: "Report issues with garbage collection." },
        ]
      },
       {
        title: "Citizen Grievance",
        description: "Submit complaints, suggestions, and track their status.",
        children: [
           { title: "Register Complaint", href: "https://emunicipal.telangana.gov.in/grievance", external: true, description: "File a complaint or grievance." },
        ]
      },
       {
        title: "GIS & Urban",
        description: "Explore maps and planning information.",
        children: [
           { title: "Property Location on GIS Map", href: "https://emunicipal.telangana.gov.in/gis", external: true, description: "Locate your property on the GIS map." },
           { title: "Telangana Urban Dashboard", href: "https://tgbpass.telangana.gov.in/urban-dashboard", external: true, description: "An overview of urban metrics." },
        ]
      },
    ],
  },
  {
    title: "Dashboard",
    children: [
      {
        title: 'Building Permissions',
        href: 'https://emunicipal.telangana.gov.in/Dashboard/BuildingPermissionDashboard',
        external: true,
        description: 'Analytics for building permissions and approvals.'
      },
      {
        title: 'Property Tax',
        href: 'https://emunicipal.telangana.gov.in/Dashboard/PropertyTaxDashboard',
        external: true,
        description: 'Track property tax collections and assessments.'
      },
      {
        title: 'Water Tap Connections',
        href: 'https://emunicipal.telangana.gov.in/Dashboard/WaterTapDashboard',
        external: true,
        description: 'Monitor new water tap connection applications.'
      },
      {
        title: 'Trade License',
        href: 'https://emunicipal.telangana.gov.in/Dashboard/TradeLicenseDashboard',
        external: true,
        description: 'Oversee trade license issuance and renewals.'
      },
      {
        title: 'Vacant Land Tax',
        href: 'https://emunicipal.telangana.gov.in/Dashboard/VLTAssessmentDashboard',
        external: true,
        description: 'Dashboard for vacant land tax data.'
      },
      {
        title: 'Advertisements',
        href: 'https://emunicipal.telangana.gov.in/Dashboard/AdvertisementDashboard',
        external: true,
        description: 'Track advertisement licenses and revenue.'
      },
      {
        title: 'Road Cutting',
        href: 'https://emunicipal.telangana.gov.in/Dashboard/RoadCuttingDashboard',
        external: true,
        description: 'Dashboard for road cutting permissions.'
      },
      {
        title: 'Telangana Urban Overview',
        href: 'https://tsurbansdashboard.telangana.gov.in/',
        external: true,
        description: 'A high-level overview of urban metrics.'
      },
    ]
  },
  {
    title: "Circulars & Proceedings",
    href: "/coming-soon",
  },
  {
    title: "RTI Act",
    href: "/coming-soon",
  },
  {
    title: "Photo Gallery",
    href: "/coming-soon",
  },
  {
    title: "About Municipality",
    href: "/about",
  },
  {
    title: "Contact Us",
    href: "/contact",
  },
];

// Default export required by Next.js App Router for generating /sitemap.xml
// We derive internal URLs from the above sitemap structure. External links are ignored.
export default function sitemapXml(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "") || "https://edhulapuram.example.com";

  const urls = new Set<string>();

  function walk(items: NavItem[]) {
    for (const item of items) {
      if (item.href && !item.external && !/^https?:\/\//i.test(item.href)) {
        urls.add(item.href);
      }
      if (item.children && item.children.length) walk(item.children);
    }
  }

  walk(sitemap);

  // Always include home
  urls.add("/");

  const now = new Date();
  return Array.from(urls).map((path) => ({
    url: `${base}${path.startsWith("/") ? path : `/${path}`}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
