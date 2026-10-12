import { profile } from "./profile";
import type { Box, Meta } from "./types";

interface BoardDef extends Meta {
  id: string;
  num: string;
  box: Box;
}

export const contactBoards = {
  hello: {
    id: "hello",
    num: "00",
    title: "Let's Work Together",
    kind: "Artboard",
    client: "Amita Hendre",
    year: "2026",
    role: "Graphic & UI/UX Designer",
    status: "Open to work",
    brief: "An invitation.",
    box: { x: 300, y: 320, w: 1000, h: 640 },
  },
  direct: {
    id: "direct",
    num: "01",
    title: "Direct",
    kind: "Artboard",
    client: "Amita Hendre",
    year: "2026",
    role: "Email · Phone · Location",
    status: "Replies within a day",
    brief: "Email or phone is the fastest way to reach me.",
    box: { x: 1420, y: 320, w: 1000, h: 640 },
  },
  elsewhere: {
    id: "elsewhere",
    num: "02",
    title: "Elsewhere",
    kind: "Artboard",
    year: "2026",
    role: "Behance · LinkedIn · Instagram",
    status: "1 of 3 linked",
    brief: "Portfolio work lives on Behance. LinkedIn and Instagram handles still to be added.",
    box: { x: 300, y: 1080, w: 1000, h: 560 },
  },
  message: {
    id: "message",
    num: "03",
    title: "Availability & Message",
    kind: "Artboard",
    client: "Amita Hendre",
    year: "2026",
    role: "Full-time · Freelance · Pune / Remote",
    status: "Available for work",
    brief: "Open to visual design and UI/UX roles and freelance projects. Leave a short message here.",
    box: { x: 1420, y: 1080, w: 1000, h: 560 },
  },
} as const satisfies Record<string, BoardDef>;

export type ChannelIcon = "mail" | "phone" | "pin";

export const channels: { label: string; value: string; href?: string; icon: ChannelIcon; tone: 1 | 2 | 3 }[] = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: "mail", tone: 1 },
  { label: "Phone", value: profile.phone.display, href: profile.phone.href, icon: "phone", tone: 2 },
  { label: "Location", value: profile.location, icon: "pin", tone: 3 },
];

export type SocialIcon = "globe" | "linkedin" | "instagram";

/** A social without an href renders as a dashed "to be added" placeholder. */
export const socials: { name: string; label: string; icon: SocialIcon; href?: string; display?: string }[] = [
  { name: "Behance", label: "Full portfolio", icon: "globe", href: profile.behance.href, display: profile.behance.display },
  { name: "LinkedIn", label: "Profile", icon: "linkedin" },
  { name: "Instagram", label: "Studio feed", icon: "instagram" },
];

export const engagement = ["Full-time", "Freelance", "Pune / Remote"] as const;
