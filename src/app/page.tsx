import Image from "next/image";
import { CafeStatus } from "@/components/CafeStatus";
import { CategoryNav } from "@/components/CategoryNav";
import {
  DEFAULT_CAFE_NAME,
  getPublishedContent,
  formatHoursGroups,
  isPlaceholderIntro,
  type MenuCategory,
  type MenuItem,
} from "@/lib/cafe-content";

const categories: MenuCategory[] = [
  { name: "Espresso bar", slug: "espresso", note: "Classics from the machine" },
  { name: "House specials", slug: "specials", note: "Drinks we love making" },
  { name: "No coffee", slug: "no-coffee", note: "Tea, soda, and more" },
  { name: "Bakery", slug: "bakery", note: "Bakes for the table" },
];

const sampleMenu: MenuItem[] = [
  {
    name: "Demo flat white",
    description: "A fictional double shot with silky steamed milk.",
    category: "espresso",
    price: 145,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=82",
    imageAlt: "Sample stock photo of a cup of coffee; not a cafe product photo",
    availability: "available",
  },
  {
    name: "Cloud nine latte",
    description: "Imaginary espresso, vanilla, and a soft cream cap.",
    category: "specials",
    price: 185,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1000&q=82",
    imageAlt: "Sample stock photo of iced coffee; not a cafe product photo",
    availability: "available",
  },
  {
    name: "Citrus daydream",
    description: "A made-up sparkling citrus cooler over ice.",
    category: "no-coffee",
    price: 160,
    image: null,
    imageAlt: "Photo placeholder for a fictional drink; no cafe photo is available",
    availability: "unavailable",
  },
  {
    name: "Very demo croissant",
    description: "A layout-test pastry with absolutely fictional details.",
    category: "bakery",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=82",
    imageAlt: "Sample stock photo of a croissant; not a cafe product photo",
    availability: "available",
  },
];

function SocialIcon({ platform }: { platform: "facebook" | "instagram" | "tiktok" }) {
  if (platform === "facebook") {
    return (
      <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V21h3.4Z" />
      </svg>
    );
  }

  if (platform === "instagram") {
    return (
      <svg className="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.6 7.2a5.2 5.2 0 0 1-3.2-1.1v7.3a5.8 5.8 0 1 1-5-5.7v3.1a2.7 2.7 0 1 0 1.9 2.6V2h3.1a5.2 5.2 0 0 0 3.2 3.7v1.5Z" />
    </svg>
  );
}

function VisitIcon({ name }: { name: "location" | "clock" | "message" | "phone" | "directions" }) {
  const paths = {
    location: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2.25" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
    message: (
      <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.8-3.4A7.5 7.5 0 1 1 20 11.5Z" />
    ),
    phone: (
      <path d="M7.2 3.8 10 7.5 8.2 9.3a14 14 0 0 0 6.5 6.5l1.8-1.8 3.7 2.8-.8 3a1.7 1.7 0 0 1-1.8 1.2A18.8 18.8 0 0 1 3.8 7.2 1.7 1.7 0 0 1 5 5.4l2.2-1.6Z" />
    ),
    directions: (
      <>
        <path d="M13 5h6v6" />
        <path d="m19 5-9 9" />
        <path d="M17 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5" />
      </>
    ),
  };

  return (
    <svg
      className="visit-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function MenuContent({
  categories,
  items,
  status,
  conceptPreview,
}: {
  categories: MenuCategory[];
  items: MenuItem[];
  status: "loading" | "ready";
  conceptPreview: boolean;
}) {
  if (status === "loading") {
    return (
      <div className="menu-grid" role="status" aria-label="Loading menu" aria-busy="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="menu-skeleton" key={index}>
            <div className="skeleton-image" />
            <div className="skeleton-line skeleton-line-short" />
            <div className="skeleton-line" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-state" role="status">
        <span className="empty-mark" aria-hidden="true">+</span>
        <h3>The menu is taking a little break.</h3>
        <p>Please check back soon.</p>
      </div>
    );
  }

  return (
    <>
      <CategoryNav categories={categories} />
      <div className="category-list">
        {categories.map((category, categoryIndex) => {
        const categoryItems = items.filter((item) => item.category === category.slug);

        if (categoryItems.length === 0) return null;

        return (
          <section
            className="menu-category"
            id={category.slug}
            key={category.slug}
            aria-labelledby={`${category.slug}-title`}
          >
            <div className="category-heading">
              <h3 id={`${category.slug}-title`}>{category.name}</h3>
              {category.note ? <p>{category.note}</p> : null}
            </div>
            <div className="menu-grid">
              {categoryItems.map((item, itemIndex) => (
                <article
                  className="menu-item"
                  key={item.name}
                  style={{ animationDelay: `${(categoryIndex + itemIndex) * 80}ms` }}
                >
                <div
                  className={`item-image${item.image ? "" : " item-image-placeholder"}`}
                  role="img"
                  aria-label={item.featured ? `${item.imageAlt}; featured item` : item.imageAlt}
                    style={item.image ? { backgroundImage: `url("${item.image}")` } : undefined}
                  >
                    {item.featured && (
                      <span className="featured-badge">Best seller</span>
                    )}
                    {conceptPreview && item.image && (
                      <span className="image-caption">Sample</span>
                    )}
                    {!item.image && <span className="image-caption">Photo soon</span>}
                    {item.availability === "unavailable" && (
                      <span className="availability-badge">Sold out</span>
                    )}
                  </div>
                  <div className="item-copy">
                    <div className="item-title-row">
                      <h4>{item.name}</h4>
                      <span className="item-price">₱{item.price}</span>
                    </div>
                    {item.description ? <p>{item.description}</p> : null}
                    {item.availability === "unavailable" && (
                      <span className="unavailable-note">Not available today</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
        })}
      </div>
    </>
  );
}

export default async function Home() {
  const content = await getPublishedContent();
  const conceptPreview = content === null;
  const menuCategories = content?.categories ?? categories;
  const menuItems = content?.items ?? sampleMenu;
  const cafeInfo = content?.cafeInfo;
  const cafeName = content?.siteSettings?.cafeName?.trim() || DEFAULT_CAFE_NAME;
  const heroHeadline =
    content?.siteSettings?.heroHeadline?.trim() || "Good things\nare brewing.";
  const menuHeading =
    content?.siteSettings?.menuHeading?.trim() || "Find your usual — or a new favorite.";
  const visitHeading =
    content?.siteSettings?.visitHeading?.trim() || "Come by this afternoon.";
  const footerCopyright =
    content?.siteSettings?.footerCopyright?.trim() || `© ${new Date().getFullYear()} ${cafeName}`;
  const logo = content?.siteSettings?.logo;
  const heroImage = content?.siteSettings?.heroImage;
  const cmsIntro = (content?.siteSettings?.introduction || cafeInfo?.introduction)?.trim();
  const welcomeCopy =
    cmsIntro && !isPlaceholderIntro(cmsIntro)
      ? cmsIntro
      : conceptPreview
        ? "A first look at the menu experience. Real offerings and cafe details will go here after the owner approves them."
        : "Espresso, signatures, and pastries in Yati, Liloan.";
  const hoursGroups = cafeInfo?.hours.length ? formatHoursGroups(cafeInfo.hours) : [];

  return (
    <>
      <div id="top" aria-hidden="true" />
      {conceptPreview && (
        <div className="demo-ribbon">
          <span className="ribbon-dot" aria-hidden="true" />
          Sample preview — items, prices, and photos are fictional
        </div>
      )}
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#top" aria-label={`${cafeName} — back to top`}>
            {logo && (
              <Image
                className="brand-logo"
                src={logo.url}
                alt=""
                width={48}
                height={48}
                unoptimized
              />
            )}
            <span className="wordmark-text">{cafeName}</span>
          </a>
          <nav className="primary-nav" aria-label="Main navigation">
            <a href="#menu-title">Menu</a>
            <a href="#visit">Visit</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="intro-band" aria-labelledby="intro-title">
          <div className="intro-inner">
            <div className="intro-copy">
              {conceptPreview && (
                <p className="eyebrow"><span />A cafe catalog in progress</p>
              )}
              <h1 id="intro-title">{heroHeadline}</h1>
              <p className="intro-description">{welcomeCopy}</p>
              <a className="intro-link" href="#menu-title">
                {conceptPreview ? "Explore the sample menu" : "Explore the menu"} <span aria-hidden="true">↓</span>
              </a>
            </div>
            {heroImage ? (
              <div className="intro-photo">
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt}
                  fill
                  sizes="(max-width: 600px) 280px, 360px"
                  preload
                  unoptimized
                />
                {cafeInfo?.hours.length ? <CafeStatus hours={cafeInfo.hours} compact /> : null}
              </div>
            ) : conceptPreview ? (
              <div className="intro-stamp" aria-label="Prototype, not approved for launch">
                <span>THE</span>
                <strong>FIRST<br />POUR</strong>
                <span>PROTOTYPE / 01</span>
              </div>
            ) : null}
            <div className="intro-pattern" aria-hidden="true" />
          </div>
        </section>

        <section className="catalog-section" id="menu" aria-labelledby="menu-title">
          <div className="catalog-heading">
            <h2 id="menu-title">{menuHeading}</h2>
          </div>

          <MenuContent
            categories={menuCategories}
            items={menuItems}
            status="ready"
            conceptPreview={conceptPreview}
          />
        </section>

        <section className="visit-section" id="visit" aria-labelledby="visit-title">
          <div className="visit-heading">
            <h2 id="visit-title">{visitHeading}</h2>
          </div>
          <dl className="visit-details">
            <div>
              <dt><VisitIcon name="location" />Find us</dt>
              <dd>
                {cafeInfo?.address || "Location to be confirmed"}
                {cafeInfo?.mapUrl && (
                  <a className="visit-link directions-link" href={cafeInfo.mapUrl} target="_blank" rel="noreferrer">
                    <VisitIcon name="directions" />
                    Get directions
                  </a>
                )}
              </dd>
            </div>
            <div>
              <dt><VisitIcon name="clock" />Hours</dt>
              <dd>
                {hoursGroups.length ? (
                  <ul className="hours-list">
                    {hoursGroups.map(({ days, time }) => (
                      <li key={days}>
                        <span>{days}</span>
                        <span>{time}</span>
                      </li>
                    ))}
                  </ul>
                ) : "Hours to be confirmed"}
              </dd>
            </div>
            <div>
              <dt><VisitIcon name="message" />Stay connected</dt>
              <dd>
                {cafeInfo?.phone && (
                  <a className="visit-link social-link" href={`tel:${cafeInfo.phone.replace(/[^\d+]/g, "")}`}>
                    <VisitIcon name="phone" />
                    {cafeInfo.phone}
                  </a>
                )}
                {cafeInfo?.facebookUrl && (
                  <a className="visit-link social-link" href={cafeInfo.facebookUrl} target="_blank" rel="noreferrer">
                    <SocialIcon platform="facebook" />
                    <span>Facebook</span>
                  </a>
                )}
                {cafeInfo?.instagramUrl && (
                  <a className="visit-link social-link" href={cafeInfo.instagramUrl} target="_blank" rel="noreferrer">
                    <SocialIcon platform="instagram" />
                    <span>Instagram</span>
                  </a>
                )}
                {cafeInfo?.tiktokUrl && (
                  <a className="visit-link social-link" href={cafeInfo.tiktokUrl} target="_blank" rel="noreferrer">
                    <SocialIcon platform="tiktok" />
                    <span>TikTok</span>
                  </a>
                )}
                {cafeInfo?.menuDocumentUrl && (
                  <a className="visit-link" href={cafeInfo.menuDocumentUrl} target="_blank" rel="noreferrer">Menu PDF</a>
                )}
                {!cafeInfo?.phone && !cafeInfo?.facebookUrl && !cafeInfo?.instagramUrl && !cafeInfo?.menuDocumentUrl
                  && !cafeInfo?.tiktokUrl
                  ? "Contact details to be confirmed"
                  : null}
              </dd>
            </div>
          </dl>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <span>{cafeName}</span>
        </div>
        <p className="footer-copyright">{footerCopyright}</p>
      </footer>
    </>
  );
}
