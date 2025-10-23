import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { NavItem } from "@/app/sitemap";

const findImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    return {
      id: "placeholder",
      imageUrl: "https://placehold.co/600x400",
      imageHint: "placeholder",
      description: "Placeholder image",
    };
  }
  return image;
};

export type NavigationLink = {
  title: string;
  href: string;
  external?: boolean;
};

export type NavigationGroup = {
  title?: string;
  links: NavigationLink[];
};

export type NavigationItem = {
  label: string;
  href?: string;
  external?: boolean;
  icon?: string;
  groups?: NavigationGroup[];
  links?: NavigationLink[];
};

export const siteConfig = {
  name: "Edulapuram Municipality",
  shortName: "Edulapuram",
  contact: {
    phone: "08742-232322",
    email: "commissioner.edulapuram@gmail.com",
  },
  socials: [
    { name: "Facebook", url: "/coming-soon", icon: "Facebook" },
    { name: "Twitter", url: "/coming-soon", icon: "Twitter" },
    { name: "Youtube", url: "/coming-soon", icon: "Youtube" },
    { name: "Whatsapp", url: "/coming-soon", icon: "Whatsapp" },
    { name: "Apple", url: "/coming-soon", icon: "Apple" },
    { name: "Android", url: "/coming-soon", icon: "Android" },
  ],
};

export const navigationData: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
    icon: "Home",
  },
  {
    label: "Staff & Contacts",
    href: "/staff",
  },
  {
    label: "Citizen Services",
    groups: [
      {
        title: "Property-Related",
        links: [
          { title: "Property Tax Payment", href: "https://cdma.cgg.gov.in/cdma_arbs/CDMA_PG/PTMenu#", external: true },
          { title: "Property Tax Calculator", href: "https://cdma.cgg.gov.in/CDMA_PT/SelfAssessment/PT_Tax_Calculator", external: true },
          { title: "Property Tax Self Assessment", href: "https://cdma.cgg.gov.in/CDMA_PT/SelfAssessment/SelfAssessment", external: true },
          { title: "Vacant Land Tax", href: "https://emunicipal.telangana.gov.in/", external: true },
          { title: "Mutation / Ownership Transfer", href: "https://cdma.cgg.gov.in/cdma_arbs/CDMA_PG/getmutationdetails", external: true },
          { title: "Download Mutation Certificate", href: "https://cdma.cgg.gov.in/CDMA_PT/Mutation/Index", external: true },
          { title: "Tax Payment Status / Receipt", href: "https://cdma.cgg.gov.in/cdma_arbs/General/CheckPaymentStatus", external: true },
        ],
      },
      {
        title: "Water Supply",
        links: [
          { title: "New Water Tap Connection", href: "https://emunicipal.telangana.gov.in/waterconnection", external: true },
          { title: "Water Tap Connection Renewal", href: "https://emunicipal.telangana.gov.in/", external: true },
          { title: "Water Tap Bill Payment", href: "https://emunicipal.telangana.gov.in/waterpayment", external: true },
          { title: "Check Water Connection Status", href: "https://cdma.cgg.gov.in/CDMA_WT/WaterTap/ApplicationStatus", external: true },
          { title: "Download Water Tap Certificate", href: "https://cdma.cgg.gov.in/cdma_arbs/PaymentsAck/GetWTAckdetails", external: true },
        ],
      },
      {
        title: "Trade & Business",
        links: [
          { title: "Apply for Trade License", href: "https://emunicipal.telangana.gov.in/tradelicense", external: true },
          { title: "Renewal of Trade License", href: "https://cdma.cgg.gov.in/CDMA_ARBS/CDMA_PG/TLMENU", external: true },
          { title: "Trade License Application Status", href: "https://cdma.cgg.gov.in/CDMA_ARBS/CDMA_PG/TLMENU#", external: true },
          { title: "Trade License Fee Payment", href: "https://emunicipal.telangana.gov.in/tlpayment", external: true },
        ],
      },
      {
        title: "Building Permissions",
        links: [
          { title: "Apply for Building Permission", href: "https://buildnow.telangana.gov.in/", external: true },
          { title: "Check Building Permission Status", href: "https://tgbpass.telangana.gov.in/", external: true },
          { title: "Road Cutting Permission", href: "https://tg-roadcutting.cgg.gov.in/login#no-back-button", external: true },
        ],
      },
      {
        title: "Birth & Death Registration",
        links: [
          { title: "Register Birth / Death", href: "https://ubdmis.telangana.gov.in/", external: true },
          { title: "Apply / Search Birth Certificate", href: "https://emunicipal.telangana.gov.in/birthcertificate", external: true },
          { title: "Apply / Search Death Certificate", href: "https://emunicipal.telangana.gov.in/deathcertificate", external: true },
        ],
      },
      {
        title: "Citizen Support",
        links: [
          { title: "Register Complaint / Grievance", href: "https://emunicipal.telangana.gov.in/grievance", external: true },
          { title: "Track Complaint Status", href: "https://emunicipal.telangana.gov.in/grievance", external: true },
          { title: "Feedback / Suggestion", href: "https://emunicipal.telangana.gov.in/", external: true },
        ],
      },
      {
        title: "Public Health & Sanitation",
        links: [
          { title: "Garbage Collection Complaint", href: "https://emunicipal.telangana.gov.in/sanitation", external: true },
          { title: "Street Light Repair Complaint", href: "http://120.138.9.117:8080/tgnew/", external: true },
          { title: "Drainage / Sewerage Issue", href: "https://emunicipal.telangana.gov.in/", external: true },
        ],
      },
      {
        title: "Urban / GIS",
        links: [
          { title: "Property Location on GIS Map", href: "https://bhuvan-app1.nrsc.gov.in/cdma/index.php", external: true },
          { title: "Telangana Urban Dashboard", href: "https://tgbpass.telangana.gov.in/urban-dashboard", external: true },
        ],
      },
      {
        title: "Court & Legal",
        links: [
          { title: "Court Case Monitoring", href: "https://municipalservices.in/CCMS/", external: true },
        ],
      },
    ],
  },
  {
    label: "Dashboard",
    links: [
      { title: "Building Permission Dashboard", href: "https://buildnow.telangana.gov.in/", external: true },
      { title: "Water Tap Connection Dashboard", href: "https://cdma.cgg.gov.in/cdma_wt/reports/WT_DASHBOARD_RPT", external: true },
      { title: "IGRS Auto Mutation Dashboard", href: "https://cdma.cgg.gov.in/cdma_pt/Reports/PT_MUTATION_DASHBOARD_RPT", external: true },
      { title: "Trade License Dashboard", href: "https://cdma.cgg.gov.in/CDMA_TRADE/reports/TL_DASHBOARD_RPT", external: true },
      { title: "Property / Water Tax Payment Status", href: "https://cdma.cgg.gov.in/cdma_arbs/General/CheckPaymentStatus", external: true },
      { title: "Telangana Green Funds Portal", href: "https://telangana.emunicipal.in/login", external: true },
      { title: "Road Cutting Permission Dashboard", href: "https://tg-roadcutting.cgg.gov.in/login#no-back-button", external: true },
      { title: "Right of Way / Mobile Tower Dashboard", href: "https://tg-rightofway.cgg.gov.in/dashboardReportDet", external: true },
      { title: "Citizen Services Monitoring System", href: "https://www.municipalservices.in/", external: true },
      { title: "Unified Birth and Death MIS", href: "https://ubdmis.telangana.gov.in/", external: true },
      { title: "CDMA Data on Bhuvan Map", href: "https://bhuvan-app1.nrsc.gov.in/cdma/index.php", external: true },
      { title: "Court Case Monitoring System", href: "https://municipalservices.in/CCMS/", external: true },
      { title: "Smart Street Light System", href: "http://120.138.9.117:8080/tgnew/", external: true },
    ],
  },
  {
    label: "RTI",
    href: "/coming-soon",
  },
  {
    label: "About Municipality",
    href: "/about",
  },
];

export type ServiceLink = {
  title: string;
  href: string;
  external?: boolean;
  category: string;
};

const collectServiceLinks = () => {
  const services: ServiceLink[] = [];

  navigationData.forEach((item) => {
    const categoryLabel = item.label;

    if (item.links) {
      item.links.forEach((link) => {
        services.push({
          title: link.title,
          href: link.href,
          external: link.external,
          category: categoryLabel,
        });
      });
    }

    if (item.groups) {
      item.groups.forEach((group) => {
        const groupLabel = group.title || categoryLabel;
        group.links.forEach((link) => {
          services.push({
            title: link.title,
            href: link.href,
            external: link.external,
            category: groupLabel,
          });
        });
      });
    }
  });

  return services;
};

export const serviceLinks: ServiceLink[] = collectServiceLinks();

export const headerData = {
  logo: {
    id: "telangana-logo",
    imageUrl: "/images/TG_LOGO.jpg",
    imageHint: "telangana emblem",
    description: "The official emblem of the Government of Telangana.",
  },
  cdmaLogo: findImage("cdma-logo"),
  telanganaRisingLogo: {
    id: "telangana-rising-logo",
    imageUrl: "/images/RISING_ONE_TG.jpg",
    imageHint: "telangana rising",
    description: "The official logo for Telangana Rising."
  }
};

export const heroData = {
  title: "Edulapuram Municipality",
  subtitle:
    "Welcome to the official portal. Serving citizens with dedication and transparency.",
  backgroundImage: findImage("hero-background"),
  ctas: [
    {
      text: "Pay Property Tax",
      href: "https://cdma.cgg.gov.in/cdma_arbs/CDMA_PG/PTMenu",
      variant: "accent",
    },
    {
      text: "Apply for Water Tap",
      href: "https://emunicipal.telangana.gov.in/etistmvcdfwefrzxczx/ljkljkljkl",
      variant: "default",
    },
    {
      text: "Submit Grievance",
      href: "https://egovindia.in/ulbwisecomplaints/index.php",
      variant: "default",
    },
  ],
};

export const newsTickerData = {
  title: {
    en: "Latest News",
    te: "తాజా వార్తలు",
  },
  news: [
    {
      en: "Special sanitation drive from 1st to 15th of this month.",
      te: "ప్రత్యేక పరిశుభ్రత కార్యక్రమం ఈ నెల 1 నుంచి 15 వరకు నిర్వహించబడుతుంది.",
    },
    {
      en: "Property tax payment deadline extended to March 31st.",
      te: "ఆస్తి పన్ను చెల్లింపు గడువు మార్చి 31 వరకు పొడిగించబడింది.",
    },
    {
      en: "Applications open for new trade licenses.",
      te: "క్రొత్త వ్యాపార లైసెన్స్ దరఖాస్తులు అందుబాటులో ఉన్నాయి.",
    },
    {
      en: "Free health camp at the community hall on Sunday.",
      te: "ఆదివారం కమ్యూనిటీ హాల్‌లో ఉచిత ఆరోగ్య శిబిరం.",
    },
    {
      en: "Water supply maintenance work in Ward 5 on Tuesday night.",
      te: "మంగళవారం రాత్రి 5వ వార్డులో నీటి సరఫరా మరమ్మతులు జరుగుతాయి.",
    },
  ],
};

export const quickStatsData = {
  title: "Municipality at a Glance",
  stats: [
    { label: "Population", value: 58647, icon: "Users" },
    { label: "Wards", value: 32, icon: "Map" },
    { label: "Total Roads (km)", value: 463.58, icon: "Waypoints" },
    { label: "Street Lights", value: 11967, icon: "Lightbulb" },
  ],
};

export const servicesData = {
  title: "Citizen Services",
  subtitle: "Access essential services online.",
  services: [
    {
      title: "Property Tax (House Tax)",
      href: "https://cdma.cgg.gov.in/cdma_arbs/CDMA_PG/PTMenu",
      icon: "Home",
    },
    {
      title: "Property Tax (Vacant Land)",
      href: "https://cdma.cgg.gov.in/cdma_arbs/CDMA_VLT/VLTMenu",
      icon: "LandPlot",
    },
    {
      title: "Water Tap Connection",
      href: "https://emunicipal.telangana.gov.in/etistmvcdfwefrzxczx/ljkljkljkl",
      icon: "Droplets",
    },
    {
      title: "Trade License",
      href: "https://emunicipal.telangana.gov.in/etistmvcdfwefrzxczx/dgdfgdfgdfgfd",
      icon: "Store",
    },
     {
      title: "Trade License Renewal",
      href: "https://emunicipal.telangana.gov.in/etistmvcdfwefrzxczx/gdfgdfgdf",
      icon: "RefreshCw",
    },
    {
      title: "Signage License",
      href: "https://emunicipal.telangana.gov.in/etistmvcdfwefrzxczx/bnmbmbnmbn",
      icon: "Megaphone",
    },
    {
      title: "Mobile Towers",
      href: "https://emunicipal.telangana.gov.in/etistmvcdfwefrzxczx/kjhkjhkjhkjh",
      icon: "Signal",
    },
    {
      title: "Mutations",
      href: "https://emunicipal.telangana.gov.in/etistmvcdfwefrzxczx/cbvcbvcbcv",
      icon: "Copy",
    },
    {
      title: "Building Permissions",
      href: "https://buildnow.telangana.gov.in/",
      icon: "Building",
    },
    {
      title: "Road Cutting Permissions",
      href: "https://emunicipal.telangana.gov.in/etistmvcdfwefrzxczx/sdfsfsdfsdf",
      icon: "Scissors",
    },
    {
      title: "Grievances",
      href: "https://egovindia.in/ulbwisecomplaints/index.php",
      icon: "MessageSquareWarning",
    },
    {
      title: "Unified Birth & Death",
      href: "https://emunicipal.telangana.gov.in/etistmvcdfwefrzxczx/mnmbnmnbmnbm",
      icon: "FileText",
    },
    {
      title: "RTI Applications",
      href: "https://rti.telangana.gov.in/",
      icon: "FileText",
    },
    {
      title: "Citizen Charter",
      href: "https://cdma.telangana.gov.in/CitizenCharters",
      icon: "Copy",
    },
    {
      title: "Helpline & Emergency Contacts",
      href: "https://cdma.telangana.gov.in/Helpline",
      icon: "Phone",
    },
    {
      title: "Sanitation Worker Welfare",
      href: "https://cdma.telangana.gov.in/Sanitation",
      icon: "ShieldCheck",
    },
    {
      title: "Citizen Feedback Portal",
      href: "https://telanganacmo.telangana.gov.in/Feedback",
      icon: "MessageSquareWarning",
    },
    {
      title: "Ward Committee Meetings",
      href: "https://cdma.telangana.gov.in/WardMeetings",
      icon: "Users",
    },
  ],
};

export const eventsData = {
  title: "Recent Events & Gallery",
  subtitle: "Glimpses of our community initiatives and programs.",
  events: [
    {
      ...findImage("event-1"),
      title: "New Community Hall Inaugurated",
      date: "2024-05-20",
    },
    {
      ...findImage("event-2"),
      title: "Village Health Camp",
      date: "2024-05-15",
    },
    {
      ...findImage("event-3"),
      title: "Haritha Haaram Plantation Drive",
      date: "2024_05_10",
    },
    {
      ...findImage("event-4"),
      title: "Annual School Day Celebrations",
      date: "2024-05-05",
    },
  ],
};

export const projectsData = {
  title: "Development Projects",
  subtitle: "Tracking our progress towards a better Edulapuram.",
  projects: [
    {
      slug: "led-street-lights",
      name: "LED Street Lights",
      description: "Procurement of LED street lights and related material to enhance visibility and safety across the municipality. This project focuses on replacing outdated lighting with energy-efficient LED technology.",
      cost: "₹10.00 Lakh",
      completion: 100,
      status: "Completed",
      icon: "Lightbulb",
      timeline: "Q1 2024",
      gallery: [
        findImage("project-led-1"),
        findImage("project-led-2"),
      ],
    },
    {
      slug: "sanitation-vehicle-repairs",
      name: "Sanitation Vehicle Repairs",
      description: "Annual Maintenance of Repairs to sanitation vehicles and other related sanitation machines to ensure uninterrupted waste collection and management services.",
      cost: "₹5.00 Lakh",
      completion: 75,
      status: "Ongoing",
      icon: "Wrench",
      timeline: "Q2 2024",
      gallery: [
        findImage("project-sanitation-1"),
        findImage("project-sanitation-2"),
      ],
    },
    {
      slug: "sanitation-safety-equipment",
      name: "Sanitation Safety & Equipment",
      description: "Supply and Delivery of conservation and safety material for sanitation Workers & Hiring of JCB & Dozer other machines to ensure the safety and efficiency of our sanitation staff.",
      cost: "₹10.00 Lakh",
      completion: 55,
      status: "Ongoing",
      icon: "Shield",
      timeline: "Q2-Q3 2024",
      gallery: [
          findImage("project-safety-1"),
          findImage("project-safety-2"),
      ]
    },
    {
      slug: "water-supply-maintenance",
      name: "Water Supply Maintenance Materials",
      description: "Supply and delivery of materials for water supply maintenance, including arresting leakages, road cutting restoration, and water transportation to ensure consistent water availability for all residents.",
      cost: "₹20.00 Lakh",
      completion: 50,
      status: "Ongoing",
      icon: "Droplets",
      timeline: "Ongoing",
      gallery: [
        findImage("project-water-1"),
        findImage("project-water-2"),
      ]
    },
     {
      slug: "hand-pump-repair",
      name: "Hand Pump Repair",
      description: "Purchasing and repairing of hand pump material & tools for water supply annual maintenance, ensuring that traditional water sources remain functional and accessible.",
      cost: "₹10.00 Lakh",
      completion: 50,
      status: "Ongoing",
      icon: "Wrench",
      timeline: "Ongoing",
       gallery: [
        findImage("project-pump-1"),
        findImage("project-pump-2"),
      ]
    },
    {
      slug: "motor-pump-repairs",
      name: "Motor/Pump Repairs",
      description: "Repairs and rewinding of submersible Motors and pump sets and open well motors to maintain the efficiency of the automated water supply system.",
      cost: "₹11.00 Lakh",
      completion: 50,
      status: "Ongoing",
      icon: "Wrench",
      timeline: "Ongoing",
      gallery: [
        findImage("project-motor-1"),
        findImage("project-motor-2"),
      ]
    },
    {
      slug: "submersible-pump-sets",
      name: "Submersible Pump Sets",
      description: "Supply and delivery of submersible motor pump sets for all other related spare parts for annual maintenance.",
      cost: "₹9.00 Lakh",
      completion: 40,
      status: "Ongoing",
      icon: "Workflow",
      timeline: "Q3 2024",
       gallery: [
        findImage("project-submersible-1"),
        findImage("project-submersible-2"),
      ]
    },
    {
      slug: "median-plantation",
      name: "Median Plantation",
      description: "Supply and Delivery planting of Median plantation from Warangal X Road to Edulapuram Junction and Mahabubabad Cross road to beautify the city and improve green cover.",
      cost: "₹15.50 Lakh",
      completion: 0,
      status: "Pending",
      icon: "Flower2",
      timeline: "Q4 2024",
       gallery: [
        findImage("project-plantation-1"),
        findImage("project-plantation-2"),
      ]
    },
  ],
};


export const keyOfficialsData = {
  title: "Key Officials",
  subtitle: "Meet the team leading our municipality.",
  officials: [
    {
      id: "cm-telangana",
      imageUrl: "/images/CM_TG.jpg",
      description: "Official portrait of the Chief Minister of Telangana.",
      imageHint: "male politician",
      name: "Sri A. Revanth Reddy",
      designation: "Hon'ble Chief Minister",
      bio: "Heads the Government of Telangana, driving statewide policy and development initiatives for citizens.",
    },
    {
      id: "collector",
      imageUrl: "/images/COLLECTR_KHMM.jpg",
      description: "District Collector Sri Anudeep Durishetty, IAS",
      imageHint: "male IAS officer portrait",
      name: "Sri Anudeep Durishetty, IAS",
      designation: "District Collector, Khammam",
      bio: "Assumed charge on 13 June 2025. 2018 batch IAS officer with prior roles as Joint Collector of Bhadradri Kothagudem and Collector of Hyderabad.",
    },
    {
      id: "commissioner",
      imageUrl: "/images/ALLA_SRINIVAS.jpeg",
      description: "Municipal Commissioner Sri Alla Srinivas",
      imageHint: "municipal commissioner portrait",
      name: "Sri Alla Srinivas Reddy",
      designation: "Municipal Commissioner",
      bio: "Leads municipal operations, focusing on citizen services, smart governance and effective resource management for Edulapuram.",
    },
    {
      ...findImage("mayor"),
      id: "mayor",
      name: "Smt. PQR",
      designation: "Mayor",
      bio: "Chairs municipal council meetings and represents the aspirations of Edulapuram's citizens.",
    },
     {
      id: "deo",
      imageUrl: "https://picsum.photos/seed/deo/400/400",
      description: "Official portrait of the Deputy Executive Officer.",
      imageHint: "female official",
      name: "Smt. LMN",
      designation: "Dy. Executive Officer",
      bio: "Coordinates departmental teams and supports implementation of flagship programmes across wards.",
    },
    {
      id: "engineer",
      imageUrl: "https://picsum.photos/seed/engineer/400/400",
      description: "Official portrait of the Municipal Engineer.",
      imageHint: "male professional",
      name: "Sri UVW",
      designation: "Municipal Engineer",
      bio: "Leads infrastructure planning, construction quality and maintenance of civic assets.",
    },
    {
      id: "revenue-officer",
      imageUrl: "https://picsum.photos/seed/revenue/400/400",
      description: "Official portrait of the Revenue Officer.",
      imageHint: "male official",
      name: "Sri EFG",
      designation: "Revenue Officer",
      bio: "Manages assessment, billing and collection of municipal revenues across all wards.",
    },
    {
      id: "sanitary-inspector",
      imageUrl: "https://picsum.photos/seed/sanitary/400/400",
      description: "Official portrait of the Sanitary Inspector.",
      imageHint: "female professional",
      name: "Smt. IJK",
      designation: "Sanitary Inspector",
      bio: "Monitors cleanliness drives, waste management operations and public health campaigns.",
    }
  ],
};

export const footerData = {
  usefulLinks: [
    { text: "About Us", href: "/about" },
    { text: "Services", href: "/#services" },
    { text: "Projects", href: "/#projects" },
    { text: "Notices", href: "/coming-soon" },
    { text: "Contact", href: "/contact" },
  ],
  governmentLinks: [
    { text: "Telangana State Portal", href: "https://www.telangana.gov.in/" },
    { text: "CDMA, Telangana", href: "https://cdma.telangana.gov.in/" },
    { text: "MeeSeva Portal", href: "https://ts.meeseva.telangana.gov.in/" },
  ],
  lastUpdated: new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
};
