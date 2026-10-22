import {
  getPublishedContent,
  formatTime,
  type MenuCategory,
  type MenuItem,
} from "@/lib/cafe-content";

const categories: MenuCategory[] = [
  { name: "Espresso bar", slug: "espresso", note: "Demo classics" },
  { name: "House specials", slug: "specials", note: "Fictional favorites" },
  { name: "No coffee", slug: "no-coffee", note: "Made-up refreshers" },
  { name: "Bakery", slug: "bakery", note: "Sample bakes" },
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
        <p>There are no published items yet. Please check back soon.</p>
      </div>
    );
  }

  return (
    <>
      <nav className="category-nav" aria-label="Menu categories">
        {categories.map((category, index) => (
          <a href={`#${category.slug}`} key={category.slug}>
            <span>0{index + 1}</span> {category.name}
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
              <div>
                <span className="category-index">0{categoryIndex + 1}</span>
                <h3 id={`${category.slug}-title`}>{category.name}</h3>
              </div>
              <p>{category.note}</p>
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
                    <span className="image-caption">
                      {item.image ? (conceptPreview ? "Sample image" : "Cafe photo") : "Photo pending"}
                    </span>
                    {item.availability === "unavailable" && (
                      <span className="availability-badge">Sold out</span>
                    )}
                  </div>
                  <div className="item-copy">
                    <div className="item-title-row">
                      <h4>{item.name}</h4>
                      <span className="item-price">₱{item.price}</span>
                    </div>
                    <p>{item.description}</p>
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

  return (
    <>
      {conceptPreview && (
        <div className="demo-ribbon">
          <span className="ribbon-dot" aria-hidden="true" />
          Concept preview: all menu items, prices, and photos are fictional
        </div>
      )}
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={`${cafeName} home`}>
          {logo ? (
            <span
              className="brand-logo"
              role="img"
              aria-label={logo.alt}
              style={{ backgroundImage: `url("${logo.url}")` }}
            />
          ) : (
            <>
              <span className="wordmark-spark" aria-hidden="true">✳</span>
              <span>{cafeName}</span>
            </>
          )}
          <span className="wordmark-sub">{conceptPreview ? "CAFE / CONCEPT" : "MENU / VISIT"}</span>
        </a>
        <nav className="primary-nav" aria-label="Main navigation">
          <a href="#menu">Menu</a>
          <a href="#visit">Visit</a>
        </nav>
        <a className="header-link" href="#menu">
          Browse menu <span aria-hidden="true">↘</span>
        </a>
      </header>

      <main id="top">
        <section className="intro-band" aria-labelledby="intro-title">
          <div className="intro-inner">
            <div className="intro-copy">
              <p className="eyebrow"><span />{conceptPreview ? "A cafe catalog in progress" : "MENU AND CAFE INFORMATION"}</p>
              <h1 id="intro-title">Good things<br />are brewing.</h1>
              <p className="intro-description">
                {cafeInfo?.introduction || (conceptPreview
                  ? "A first look at the menu experience. Real offerings and cafe details will go here after the owner approves them."
                  : "Browse the current menu and find the cafe's confirmed location and hours.")}
              </p>
              <a className="intro-link" href="#menu">
                {conceptPreview ? "See the sample menu" : "Browse the menu"} <span aria-hidden="true">↓</span>
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
            <div>
              <p className="eyebrow eyebrow-dark">{conceptPreview ? "THE MENU / SAMPLE DATA" : "THE MENU"}</p>
              <h2 id="menu-title">Find your usual.<br /><em>Or your new one.</em></h2>
            </div>
            <p className="catalog-note">{conceptPreview
              ? "Everything below is made up for layout testing. Prices and availability are not real."
              : "Menu items, prices, and availability shown as published by the cafe."}</p>
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
            <p className="eyebrow">{conceptPreview ? "THE DETAILS / TO BE CONFIRMED" : "THE DETAILS"}</p>
            <h2 id="visit-title">Come by <em>sometime.</em></h2>
            <p>{conceptPreview
              ? "We’ll add the useful details as soon as the cafe confirms them."
              : "Plan your visit using the details published by the cafe."}</p>
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
              <dt>Opening hours</dt>
              <dd>
                {cafeInfo?.hours.length ? (
                  <ul className="hours-list">
                    {cafeInfo.hours.map(({ day, open, close, closed }) => (
                      <li key={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}: {closed ? "Closed" : `${formatTime(open) || "Hours pending"}${close ? ` - ${formatTime(close)}` : ""}`}
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
        <a className="footer-wordmark" href="#top">{cafeName}</a>
        <p>{conceptPreview ? "Concept preview only · Not an official menu" : "Information published by the cafe"}</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
