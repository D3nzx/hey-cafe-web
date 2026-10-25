import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  DEFAULT_CAFE_NAME,
  getPublishedContent,
  isPlaceholderIntro,
} from "@/lib/cafe-content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedContent();
  const cafeName = content?.siteSettings?.cafeName?.trim() || DEFAULT_CAFE_NAME;
  const introduction = (content?.siteSettings?.introduction || content?.cafeInfo?.introduction)?.trim();
  const logoUrl = content?.siteSettings?.logo?.url;

  const address = content?.cafeInfo?.address;
  const location = address || "Yati, Liloan, Cebu";

  return {
    title: `${cafeName} | Menu, ${location}`,
    description: isPlaceholderIntro(introduction)
      ? `${cafeName} menu, hours, and cafe details in ${location}.`
      : introduction,
    alternates: { canonical: "https://hey-cafe-web.pages.dev/" },
    icons: {
      icon: logoUrl || "/hey-cafe-logo.png",
      apple: logoUrl || "/hey-cafe-logo.png",
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
