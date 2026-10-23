import {
  getPublishedContent,
  formatHoursGroups,
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

function isPlaceholderIntro(text: string | undefined): boolean {
  if (!text?.trim()) return true;
  return /coming soon|to be confirmed|placeholder|lorem/i.test(text);
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
      <nav className="category-nav" aria-label="Menu categories">
        {categories.map((category) => (
          <a href={`#${category.slug}`} key={category.slug}>
            {category.name}
          </a>
        ))}
      </nav>
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
                    aria-label={item.imageAlt}
                    style={item.image ? { backgroundImage: `url("${item.image}")` } : undefined}
                  >
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
  const cafeName = content?.siteSettings?.cafeName || "Hey! Cafe";
  const logo = content?.siteSettings?.logo;
  const logoSrc = logo?.url || "/hey-cafe-logo.png";
  const logoAlt = logo?.alt || cafeName;
  const cmsIntro = cafeInfo?.introduction?.trim();
  const welcomeCopy =
    cmsIntro && !isPlaceholderIntro(cmsIntro)
      ? cmsIntro
      : conceptPreview
        ? "A first look at the menu experience. Real offerings and cafe details will go here after the owner approves them."
        : "Our menu and cafe details are managed by the cafe. Check back soon for updates.";
  const hoursGroups = cafeInfo?.hours.length ? formatHoursGroups(cafeInfo.hours) : [];

  return (
    <>
      {conceptPreview && (
        <div className="demo-ribbon">
          <span className="ribbon-dot" aria-hidden="true" />
          Sample preview — items, prices, and photos are fictional
        </div>
      )}
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#top" aria-label={`${cafeName} home`}>
            <img className="brand-logo" src={logoSrc} alt="" width={48} height={48} />
            <span className="wordmark-text">{cafeName}</span>
          </a>
          <nav className="primary-nav" aria-label="Main navigation">
            <a href="#menu">Menu</a>
            <a href="#visit">Visit</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="intro-band" aria-labelledby="intro-title">
          <div className="intro-inner">
            <div className="intro-copy">
              <p className="eyebrow"><span />{conceptPreview ? "A cafe catalog in progress" : "Yati, Liloan"}</p>
              <h1 id="intro-title">Good things<br />are brewing.</h1>
              <p className="intro-description">{welcomeCopy}</p>
              <a className="intro-link" href="#menu">
                {conceptPreview ? "See the sample menu" : "See the menu"} <span aria-hidden="true">↓</span>
              </a>
            </div>
            {conceptPreview && (
              <div className="intro-stamp" aria-label="Prototype, not approved for launch">
                <span>THE</span>
                <strong>FIRST<br />POUR</strong>
                <span>PROTOTYPE / 01</span>
              </div>
            )}
            <div className="intro-pattern" aria-hidden="true" />
          </div>
        </section>

        <section className="catalog-section" id="menu" aria-labelledby="menu-title">
          <div className="catalog-heading">
            <p className="eyebrow eyebrow-dark">Menu</p>
            <h2 id="menu-title">Find your usual — or a new favorite.</h2>
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
            <p className="eyebrow">Visit</p>
            <h2 id="visit-title">Come by this afternoon.</h2>
          </div>
          <dl className="visit-details">
            <div>
              <dt>Find us</dt>
              <dd>
                {cafeInfo?.address || "Location to be confirmed"}
                {cafeInfo?.mapUrl && (
                  <a className="visit-link" href={cafeInfo.mapUrl} target="_blank" rel="noreferrer">
                    Directions
                  </a>
                )}
              </dd>
            </div>
            <div>
              <dt>Hours</dt>
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
              <dt>Say hello</dt>
              <dd>
                {cafeInfo?.phone && (
                  <a className="visit-link" href={`tel:${cafeInfo.phone.replace(/[^\d+]/g, "")}`}>
                    {cafeInfo.phone}
                  </a>
                )}
                {cafeInfo?.facebookUrl && (
                  <a className="visit-link" href={cafeInfo.facebookUrl} target="_blank" rel="noreferrer">Facebook</a>
                )}
                {cafeInfo?.instagramUrl && (
                  <a className="visit-link" href={cafeInfo.instagramUrl} target="_blank" rel="noreferrer">Instagram</a>
                )}
                {cafeInfo?.menuDocumentUrl && (
                  <a className="visit-link" href={cafeInfo.menuDocumentUrl} target="_blank" rel="noreferrer">Menu PDF</a>
                )}
                {!cafeInfo?.phone && !cafeInfo?.facebookUrl && !cafeInfo?.instagramUrl && !cafeInfo?.menuDocumentUrl
                  ? "Contact details to be confirmed"
                  : null}
              </dd>
            </div>
          </dl>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#top" aria-label={`${cafeName} home`}>
          <img className="footer-logo" src="/hey-cafe-logo.png" alt="" width={36} height={36} />
          <span>{cafeName}</span>
        </a>
        <p>{conceptPreview ? "Sample preview · Not an official menu" : "Yati, Liloan, Cebu"}</p>
        <a href="#top">Back to top</a>
      </footer>
    </>
  );
}
