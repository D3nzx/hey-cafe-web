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
  const introduction = content?.cafeInfo?.introduction?.trim();
  const logoUrl = content?.siteSettings?.logo?.url;

  return {
    title: `${cafeName} — Menu`,
    description: isPlaceholderIntro(introduction)
      ? `Menu, hours, and cafe details for ${cafeName}.`
      : introduction,
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
