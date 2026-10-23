import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { createClient } from "@sanity/client";

export type MenuCategory = {
  name: string;
  slug: string;
  note: string;
};

export type MenuItem = {
  name: string;
  description: string;
  category: string;
  price: number;
  image: string | null;
  imageAlt: string;
  availability: "available" | "unavailable";
};

export type CafeHours = {
  day: string;
  open?: string;
  close?: string;
  closed?: boolean;
};

export type CafeInformation = {
  address?: string;
  mapUrl?: string;
  menuDocumentUrl?: string;
  hours: CafeHours[];
  phone?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  introduction?: string;
};

export type SiteSettings = {
  cafeName?: string;
  logo?: { url: string; alt: string } | null;
};

export type PublishedContent = {
  categories: MenuCategory[];
  items: MenuItem[];
  cafeInfo: CafeInformation | null;
  siteSettings: SiteSettings | null;
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-01";

export const sanityConfigured = Boolean(projectId);

const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: false })
  : null;

const imageBuilder = projectId
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

const CAFE_CONTENT_QUERY = `{
  "categories": *[_type == "category" && active != false && defined(slug.current)] | order(displayOrder asc, name asc) {
    name,
    "slug": slug.current,
    "note": coalesce(description, "")
  },
  "items": *[_type == "menuItem" && defined(category->slug.current)] | order(category->displayOrder asc, displayOrder asc, name asc) {
    name,
    "description": coalesce(description, ""),
    "category": category->slug.current,
    price,
    image,
    "imageAlt": coalesce(image.alt, name),
    "availability": select(available == true => "available", "unavailable")
  },
  "cafeInfo": *[_type == "cafeInfo"][0] {
    address,
    mapUrl,
    "menuDocumentUrl": menuDocument.asset->url,
    hours[]{day, open, close, closed},
    phone,
    facebookUrl,
    instagramUrl,
    introduction
  },
  "siteSettings": *[_type == "siteSettings"][0] {
    cafeName,
    logo,
    "logoAlt": coalesce(logo.alt, cafeName)
  }
}`;

type QueryResult = {
  categories?: MenuCategory[] | null;
  items?: Array<Omit<MenuItem, "image"> & { image?: SanityImageSource | null }> | null;
  cafeInfo?: (Omit<CafeInformation, "hours"> & { hours?: CafeHours[] | null }) | null;
  siteSettings?: (Omit<SiteSettings, "logo"> & {
    logo?: SanityImageSource | null;
    logoAlt?: string;
  }) | null;
};

function imageUrl(source: SanityImageSource | null | undefined): string | null {
  if (!source || !imageBuilder) return null;
  return imageBuilder.image(source).width(1000).auto("format").url();
}

/**
 * Converts a 24-hour time string (e.g. "15:00") to 12-hour format (e.g. "3:00 PM").
 * Returns the original string unchanged if it doesn't match the expected format.
 */
export function formatTime(time: string | undefined): string | undefined {
  if (!time) return undefined;
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return time;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = hours >= 12 ? "PM" : "AM";
  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;
  return minutes === "00" ? `${hours}:00 ${period}` : `${hours}:${minutes} ${period}`;
}

const WEEKDAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const WEEKDAY_SHORT: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

function formatDayList(days: string[]): string {
  if (days.length === 1) return days[0];
  if (days.length === 2) return `${days[0]} & ${days[1]}`;
  return `${days.slice(0, -1).join(", ")} & ${days[days.length - 1]}`;
}

function hoursValue(entry: CafeHours): string {
  if (entry.closed) return "Closed";
  const open = formatTime(entry.open) || "Hours pending";
  return entry.close ? `${open} – ${formatTime(entry.close)}` : open;
}

/** Groups cafe hours by shared times, e.g. "Mon, Wed & Thu" + "3:00 PM – 10:30 PM". */
export function formatHoursGroups(hours: CafeHours[]): { days: string; time: string }[] {
  const groups = new Map<string, { days: string[]; firstDay: number; closed: boolean }>();

  for (const entry of hours) {
    const key = entry.day.toLowerCase();
    const short = WEEKDAY_SHORT[key] ?? entry.day;
    const time = hoursValue(entry);
    const existing = groups.get(time);
    const dayIndex = WEEKDAY_ORDER.indexOf(key);

    if (existing) {
      existing.days.push(short);
      existing.firstDay = Math.min(existing.firstDay, dayIndex === -1 ? 99 : dayIndex);
    } else {
      groups.set(time, {
        days: [short],
        firstDay: dayIndex === -1 ? 99 : dayIndex,
        closed: Boolean(entry.closed),
      });
    }
  }

  return [...groups.entries()]
    .sort((a, b) => {
      if (a[1].closed !== b[1].closed) return a[1].closed ? 1 : -1;
      return a[1].firstDay - b[1].firstDay;
    })
    .map(([time, group]) => ({ days: formatDayList(group.days), time }));
}

export async function getPublishedContent(): Promise<PublishedContent | null> {
  if (!client) return null;

  const result = await client.fetch<QueryResult>(CAFE_CONTENT_QUERY);
  const logoUrl = imageUrl(result.siteSettings?.logo);

  return {
    categories: result.categories ?? [],
    items: (result.items ?? []).map((item) => ({
      ...item,
      image: imageUrl(item.image),
    })),
    cafeInfo: result.cafeInfo
      ? { ...result.cafeInfo, hours: result.cafeInfo.hours ?? [] }
      : null,
    siteSettings: result.siteSettings
      ? {
          cafeName: result.siteSettings.cafeName,
              logo: logoUrl
            ? {
                url: logoUrl,
                alt: result.siteSettings.logoAlt || "Cafe logo",
              }
            : null,
        }
      : null,
  };
}