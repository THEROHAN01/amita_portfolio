import type { BoardDef } from "./types";

/** About-view artboards: placement + inspectable metadata. Body copy lives below. */
export const aboutBoards = {
  intro: {
    id: "intro",
    num: "00",
    title: "Introduction",
    kind: "Artboard",
    client: "Amita Hendre",
    year: "2020 — 2026",
    role: "Graphic & UI/UX Designer",
    tools: "Adobe CS, Figma",
    status: "Available for work",
    brief:
      "A multi-disciplinary designer with 5+ years of experience creating clear and effective visual solutions across branding, marketing and digital platforms.",
    box: { x: 300, y: 320, w: 1100, h: 620 },
  },
  philosophy: {
    id: "philosophy",
    num: "01",
    title: "Design Philosophy",
    kind: "Artboard",
    year: "2026",
    role: "Three principles",
    status: "3 principles",
    brief: "Clarity first, structure before style, consistency across formats.",
    box: { x: 1520, y: 320, w: 900, h: 620 },
  },
  timeline: {
    id: "timeline",
    num: "02",
    title: "Experience & Journey",
    kind: "Artboard",
    client: "6 studios",
    year: "2020 — Present",
    role: "Intern → Graphic & UI/UX Designer",
    tools: "Adobe CS, Figma",
    status: "6 roles · 4 stages",
    brief:
      "Six roles in five years, from intern to leading UI/UX for AI products, in four stages: foundation, volume, range, product.",
    box: { x: 300, y: 1060, w: 2120, h: 860 },
  },
  skills: {
    id: "skills",
    num: "03",
    title: "Skills",
    kind: "Artboard",
    year: "2026",
    role: "Design · Digital · Practice",
    status: "15 skills",
    brief: "Layout, identity and print craft alongside UI design, UX flows and AI-assisted workflows.",
    box: { x: 300, y: 2040, w: 1000, h: 660 },
  },
  tools: {
    id: "tools",
    num: "04",
    title: "Tools",
    kind: "Artboard",
    year: "2026",
    role: "Software",
    tools: "Adobe CS, Figma, Canva, PowerPoint",
    status: "15 tools",
    brief: "Adobe Creative Suite and Figma at the centre, with an active AI-assisted stack around them.",
    box: { x: 1420, y: 2040, w: 1000, h: 660 },
  },
  awards: {
    id: "awards",
    num: "05",
    title: "Awards & Achievements",
    kind: "Artboard",
    client: "A2 Digital, Affinity Express",
    year: "2022 — 2023",
    status: "2 awards",
    brief: "Shining Star Award at A2 Digital Solutions (2023) and Star is Born Award at Affinity Express (2022).",
    box: { x: 300, y: 2820, w: 1300, h: 620 },
  },
  education: {
    id: "education",
    num: "06",
    title: "Education",
    kind: "Artboard",
    client: "Dr. D. Y. Patil College of ACS, Pune",
    role: "B.Sc. Animation",
    status: "3 entries",
    brief:
      "B.Sc. in Animation from Dr. D. Y. Patil College of Arts, Commerce & Science, Pune. HSC from Nutan Marathi Vidyalay Jr College, SSC from A. W. Sindhu Vidya Bhavan.",
    box: { x: 1720, y: 2820, w: 700, h: 620 },
  },
} as const satisfies Record<string, BoardDef>;

export const introFacts = [
  { label: "Based in", value: "New Sangvi, Pune" },
  { label: "Studios", value: "6 teams" },
  { label: "Status", value: "Available for work", accent: true },
] as const;

export const principles = [
  {
    title: "Clarity first",
    body: "Designs that are visually engaging and easy to navigate. If the message needs explaining, the layout is not finished.",
  },
  {
    title: "Structure before style",
    body: "Read the brief, then build the grid. Hierarchy and typography carry the meaning before any decoration does.",
  },
  {
    title: "Consistency across formats",
    body: "One visual language that holds from a social post to a 40-page deck to a printed label.",
  },
] as const;

/* ---------- Timeline ---------- */

/** The timeline axis runs 2020 → mid-2026; positions are percentages of that span. */
export const timelineYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026] as const;
export const YEAR_SPAN = 100 / 6.75;

export interface Stage {
  id: string;
  title: string;
  years: string;
  brief: string;
  start: number;
  width: number;
  tone: 1 | 2 | 3 | 4;
}

export const stages: Stage[] = [
  { id: "jr-1", title: "Foundation", years: "2020 — 21", start: 0, width: 14.81, tone: 1, brief: "Aptcoder, intern. Learned the craft on book covers, brochures and layouts." },
  { id: "jr-2", title: "Volume", years: "2021 — 22", start: 14.81, width: 22.22, tone: 2, brief: "Willstar Media and Affinity Express. 1,000+ ads a year taught speed and print discipline." },
  { id: "jr-3", title: "Range", years: "2022 — 25", start: 37.04, width: 39.56, tone: 3, brief: "A2 Digital and Kay Bee. Identity systems, campaigns and packaging end to end." },
  { id: "jr-4", title: "Product", years: "2025 —", start: 76.59, width: 23.41, tone: 4, brief: "KPoint Technologies. Leading UI/UX for AI-driven products." },
];

export interface Role {
  id: string;
  company: string;
  title: string;
  years: string;
  brief: string;
  start: number;
  width: number;
  tone: 1 | 2 | 3 | 4;
  current?: boolean;
}

/** Oldest first — the order the rows appear on the Gantt. */
export const roles: Role[] = [
  { id: "tl-6", company: "Aptcoder", title: "Graphic Designer (Intern)", years: "2020 — 2021", start: 0, width: 14.81, tone: 1, brief: "Book covers, layouts, brochures, illustrations and social media creatives." },
  { id: "tl-5", company: "Willstar Media", title: "Graphic Designer", years: "2021 — 2022", start: 14.81, width: 14.81, tone: 2, brief: "Identity systems, Instagram posts and YouTube thumbnails. CTR up 80%." },
  { id: "tl-4", company: "Affinity Express", title: "Junior Associate Designer", years: "2022", start: 29.63, width: 7.41, tone: 2, brief: "1,000+ print and newspaper ads a year across multiple industries." },
  { id: "tl-3", company: "A2 Digital Solutions", title: "Graphic Designer", years: "2022 — 2024", start: 37.04, width: 22.22, tone: 3, brief: "50+ brand identity assets, gaming and fantasy sports campaigns, high-conversion landing pages." },
  { id: "tl-2", company: "Kay Bee Bio Organics", title: "Graphic Designer", years: "2024 — 2025", start: 59.26, width: 17.33, tone: 3, brief: "30+ product labels and packaging designs, plus social creatives for agriculture, banking and gardening." },
  { id: "tl-1", company: "KPoint Technologies", title: "Graphic Designer", years: "Mar 2025 — Present", start: 76.59, width: 23.41, tone: 4, current: true, brief: "500+ design assets a year across BFSI, Healthcare, EdTech and Advertising. AI workflows cut turnaround by 30%." },
];

/* ---------- Skills & tools ---------- */

export const skillGroups = [
  { name: "Design", tone: 1, items: ["Brand identity", "Layout design", "Typography", "Packaging & labels", "Print production"] },
  { name: "Digital", tone: 2, items: ["UI design", "UX flows", "Wireframing", "Landing pages", "Design consistency"] },
  { name: "Practice", tone: 3, items: ["Client communication", "Brief analysis", "Multi-format content", "Deadline delivery", "AI-assisted workflows"] },
] as const;

export type ToolGroup = "adobe" | "design" | "docs" | "ai";

export const toolGroups: { id: ToolGroup; label: string; code: string }[] = [
  { id: "adobe", label: "Adobe", code: "ADO" },
  { id: "design", label: "Design", code: "DES" },
  { id: "docs", label: "Documents", code: "DOC" },
  { id: "ai", label: "AI stack", code: "AI" },
];

export const tools: { abbr: string; name: string; group: ToolGroup }[] = [
  { abbr: "Ps", name: "Photoshop", group: "adobe" },
  { abbr: "Ai", name: "Illustrator", group: "adobe" },
  { abbr: "Id", name: "InDesign", group: "adobe" },
  { abbr: "Ex", name: "Express", group: "adobe" },
  { abbr: "Fg", name: "Figma", group: "design" },
  { abbr: "Cv", name: "Canva", group: "design" },
  { abbr: "Pp", name: "PowerPoint", group: "docs" },
  { abbr: "Gs", name: "Google Slides", group: "docs" },
  { abbr: "Wd", name: "Word", group: "docs" },
  { abbr: "Ff", name: "Firefly", group: "ai" },
  { abbr: "St", name: "Stitch", group: "ai" },
  { abbr: "Fp", name: "Freepik AI", group: "ai" },
  { abbr: "Hg", name: "Heygen", group: "ai" },
  { abbr: "Fr", name: "Framer AI", group: "ai" },
  { abbr: "Lv", name: "Lovable", group: "ai" },
];

/* ---------- Awards & education ---------- */

export const awards = [
  { year: "2023", title: "Shining Star Award", org: "A2 Digital Solutions", note: "Outstanding contribution" },
  { year: "2022", title: "Star is Born Award", org: "Affinity Express", note: "Exceptional performance and early impact" },
] as const;

export const metrics = [
  { value: "500+", label: "assets / year" },
  { value: "1,000+", label: "ads / year" },
  { value: "+60%", label: "engagement" },
  { value: "−30%", label: "turnaround" },
] as const;

export const education = [
  { step: "01", level: "SSC", school: "A. W. Sindhu Vidya Bhavan", city: "Pune", height: 40 },
  { step: "02", level: "HSC", school: "Nutan Marathi Vidyalay Jr College", city: "Pune", height: 66 },
  { step: "03", level: "Degree", school: "B.Sc. Animation · Dr. D. Y. Patil College of Arts, Commerce & Science", city: "Pune", height: 100 },
] as const;
