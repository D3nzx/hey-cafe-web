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