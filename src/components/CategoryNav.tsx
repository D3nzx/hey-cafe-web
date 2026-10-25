"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MenuCategory } from "@/lib/cafe-content";

export function CategoryNav({ categories }: { categories: MenuCategory[] }) {
  const categorySlugs = useMemo(() => categories.map(({ slug }) => slug), [categories]);
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "");
  const navRef = useRef<HTMLElement>(null);
  const navigationLockUntil = useRef(0);

  useEffect(() => {
    const syncHash = () => {
      const slug = window.location.hash.slice(1);
      if (Date.now() >= navigationLockUntil.current && categorySlugs.includes(slug)) setActiveSlug(slug);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [categorySlugs]);

  useEffect(() => {
    const sections = categories
      .map(({ slug }) => document.getElementById(slug))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver((entries) => {
      if (Date.now() < navigationLockUntil.current) return;
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]?.target.id) setActiveSlug(visible[0].target.id);
    }, { rootMargin: "-96px 0px -55% 0px", threshold: 0 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    const activeLink = navRef.current?.querySelector<HTMLElement>(`[data-category="${activeSlug}"]`);
    activeLink?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeSlug]);

  return (
    <nav ref={navRef} className="category-nav" aria-label="Menu categories">
      {categories.map((category) => (
        <a
          className={activeSlug === category.slug ? "category-active" : undefined}
          data-category={category.slug}
          href={`#${category.slug}`}
          aria-current={activeSlug === category.slug ? "location" : undefined}
          key={category.slug}
          onClick={(event) => {
            event.preventDefault();
            navigationLockUntil.current = Date.now() + 1500;
            setActiveSlug(category.slug);
            window.history.replaceState(null, "", `#${category.slug}`);
            document.getElementById(category.slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          {category.name}
        </a>
      ))}
    </nav>
  );
}
