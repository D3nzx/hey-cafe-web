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
    let animationFrame = 0;

    const updateActiveCategory = () => {
      animationFrame = 0;
      if (Date.now() < navigationLockUntil.current) return;

      const trackingLine = 200;
      const containingSection = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= trackingLine && bounds.bottom > trackingLine;
      });
      const lastPassedSection = [...sections]
        .reverse()
        .find((section) => section.getBoundingClientRect().top <= trackingLine);

      setActiveSlug(containingSection?.id ?? lastPassedSection?.id ?? sections[0]?.id ?? "");
    };

    const handleScroll = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateActiveCategory);
    };

    const interruptNavigationLock = () => {
      navigationLockUntil.current = 0;
      updateActiveCategory();
    };

    updateActiveCategory();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    window.addEventListener("wheel", interruptNavigationLock, { passive: true });
    window.addEventListener("touchmove", interruptNavigationLock, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("wheel", interruptNavigationLock);
      window.removeEventListener("touchmove", interruptNavigationLock);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [categories]);

  useEffect(() => {
    const nav = navRef.current;
    const activeLink = nav?.querySelector<HTMLElement>(`[data-category="${activeSlug}"]`);
    if (!nav || !activeLink) return;

    const left = activeLink.offsetLeft - (nav.clientWidth - activeLink.offsetWidth) / 2;
    nav.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
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
