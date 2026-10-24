# Hey! Cafe Catalog: System Plan

**Project:** Mobile-first menu and cafe information website  
**Client:** Hey! Cafe, Yati, Liloan, Cebu  
**Status:** Development setup can begin before the client supplies the final menu and photos.

## Goals

- Give customers a fast, clear way to browse the cafe's menu and details on a phone.
- Let cafe staff update published menu content without editing code.
- Keep the first release inexpensive to host and straightforward to maintain.
- Build a portfolio-quality project with a documented handoff.

The client has said they are comfortable with free hosting and plans to upload menu, photos, and cafe details to the shared Google Drive folder. Treat all product data and branding as unconfirmed until supplied and approved.

## Recommended Stack

| Area | Recommendation | Why |
|---|---|---|
| Public website | Next.js App Router, React, TypeScript | Well-supported framework, good developer experience, and a strong portfolio choice |
| Styling | Tailwind CSS | Efficient responsive styling and consistent layout primitives |
| CMS | Sanity Studio and Sanity Content Lake | Hosted editor with structured content and image management; no custom admin backend to maintain |
| Hosting | Cloudflare Pages with a static Next.js export | The menu is primarily read-only, so a static site avoids running an application server |
| Repository and deployment | GitHub connected to Cloudflare Pages | Version history and automatic deployments from the chosen branch |
| Initial site address | Free hosting subdomain | No domain purchase is needed for the first release |

This architecture assumes the site does not need customer accounts, online ordering, or live inventory. Revisit the design if those become requirements. Free plans, quotas, and commercial-use terms may change; verify current provider terms before launch. Free hosting is not a guarantee of zero future costs.

## System Overview



### Content publishing flow

1. The client uploads approved menu, prices, product photos, and cafe information to the shared Drive folder.
2. The developer reviews the assets and imports them into Sanity using a validated workflow or enters them directly when the CMS is ready.
3. A cafe editor reviews and publishes content in Sanity Studio.
4. A Sanity publish event triggers a Cloudflare Pages deployment webhook.
5. Cloudflare Pages receives the webhook, validates the Sanity signature, and triggers the deploy hook for the production site.
6. Cloudflare builds the static site using the published Sanity content and deploys it if the build succeeds.
7. Customers see the latest successfully deployed content. If a build fails, the previous deployment remains live while the issue is fixed.

Content changes are not necessarily instant: they become public after the new build completes. This is an intentional simplicity and cost trade-off.

## User Roles and Permissions

| Role | Capabilities | Access boundary |
|---|---|---|
| Customer | Browse menu, categories, prices, location, hours, and social links | Public site only; no account required |
| Cafe editor | Add and edit menu items, photos, prices, and cafe details; publish updates | Sanity Studio, with only the permissions needed for content work |
| Cafe owner | Manage cafe content and invite or remove editors, subject to the CMS plan | Sanity organization/project administration; retain ownership of cafe accounts |
| Developer / maintainer | Maintain the website, schemas, build, integrations, and deployment | GitHub and hosting access; use named accounts and least privilege |

Use Sanity's hosted authentication rather than building a custom admin sign-in. Confirm the selected plan supports the required roles and number of users. Before handoff, agree who owns the Sanity project, GitHub repository, and Cloudflare account. The client should retain access and ownership of their business content.

## Content Model

Create the following document types in Sanity:

### Menu item

- Name and URL slug
- Category reference
- Price in PHP, stored as a number
- Short description
- Product image and descriptive alt text
- Featured / best-seller flag
- Availability status
- Display order
- Optional approved public menu PDF reference, if the cafe wants a downloadable PDF version of the menu

### Category

- Name and URL slug
- Display order
- Active status

### Cafe information

- Location and directions/map link, if provided
- Operating hours
- Contact details
- Facebook, Instagram, and TikTok URLs
- Optional approved introduction

### Site settings

- Cafe name and logo
- Shared presentation settings, if needed
- Optional public menu PDF field or document reference, if approved for publication

The roadmap suggests Espresso, Signature Drinks, Non-Coffee, and Pastries as initial categories. Keep these as placeholders until the cafe confirms its actual categories. Do not invent menu names, prices, availability, or business details for production.

## Development Environment Setup

### 1. Repository

- Create a GitHub repository. Keep it private while the client project is in progress; make it public only with client approval.
- Add a README, `.gitignore`, and a short project description.
- Use a main branch for deployable work and feature branches for changes. Require review before merging if another maintainer is available.

### 2. Website application

Create the Next.js app:

```bash
npx create-next-app@latest hey-cafe-web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Add the Sanity client and image URL helper:

```bash
npm install next-sanity @sanity/image-url
```

Configure Next.js for a static export by setting `output: 'export'` in `next.config.ts`. Ensure the chosen image implementation works with static export: use a Sanity image URL builder/custom loader or configure `next/image` appropriately for unoptimized remote images. Do not assume the default Next.js image optimization server exists on static hosting.

### 3. Sanity Studio

- Create a Sanity project and a production dataset.
- Keep the Studio in a separate `studio/` directory or separate project in the same repository so it can be developed and deployed independently from the public site.
- Initialize it with the Sanity CLI and add the schemas described above.
- Deploy the Studio using Sanity's hosted Studio option, or document an alternative deployment if project constraints require it.
- Add real client and developer accounts after the client agrees on account ownership.

### 4. Hosting and deployment

- Connect the website repository to Cloudflare Pages.
- Configure the build command and static output directory to match the Next.js static export (`out`). Confirm this with an initial deployment.
- Configure a Sanity webhook for published content changes. Store the Cloudflare deploy-hook URL only in Sanity's webhook configuration; do not commit it to the repository.
- Use Cloudflare Pages Functions to validate the Sanity webhook signature and then trigger the Cloudflare deploy hook. This keeps the secret out of the browser and allows the static site to remain build-only.
- Confirm the main branch deploys successfully and that a failed build leaves the last successful deployment available.

Example Cloudflare environment values for the webhook flow:

```bash
SANITY_WEBHOOK_SECRET=replace-with-a-long-random-secret
CLOUDFLARE_DEPLOY_HOOK_URL=https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/your-hook-id
```

Keep these values in Cloudflare project environment variables, not in GitHub or browser code.

### 5. Configuration and secrets

The public frontend may use these non-secret build-time values:

```text
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=YYYY-MM-DD
```

Use an explicit stable Sanity API date supported by the project. A public, read-only dataset intended for public site content should not require a write token in the browser. If a token is required for a private dataset or preview workflow, keep it in hosting environment variables, use the least-privileged token, and never expose it in `NEXT_PUBLIC_` variables or commit it to Git.

## Security and Reliability

- Use Sanity-hosted authentication and restrict Studio access to named accounts.
- Enable multi-factor authentication where available.
- Limit Sanity CORS origins to the deployed Studio and necessary local development origins.
- Never expose Sanity write tokens or Cloudflare deploy-hook URLs in browser code, source control, screenshots, or public documentation.
- Validate required fields, non-negative prices, category references, and image alt text in the CMS schema.
- Query only published content on the public site; do not expose drafts or preview credentials to customers.
- Use HTTPS hosting and keep dependencies updated.
- Keep mock data clearly identified and remove it before launch.
- Test the CMS-to-deployment webhook and verify recovery behavior before handing the site over.
- Keep an owner-controlled record of account ownership, billing contacts, and recovery access; do not share personal passwords in project files.

## Work That Can Start Before the Menu Arrives

1. Scaffold the Next.js site and Sanity Studio.
2. Define the content schemas and validation rules.
3. Build the mobile-first layout: header, category navigation, product grid, cafe details, and footer.
4. Create clearly fictional local fixtures for layout development, separated from production CMS content.
5. Implement loading, empty-menu, missing-image, and unavailable-item states.
6. Add responsive behavior and keyboard-accessible navigation.
7. Connect the CMS query and image URL builder using a development dataset or local fixtures.
8. Configure static hosting and validate the initial deployment.
9. Add the publish webhook and test the complete update flow.
10. Document local setup, deployment, content publishing, and support ownership in the repository README.

Do not represent placeholder products or imagery as actual Hey! Cafe offerings. Use neutral placeholders until the client provides assets.

## User Experience and Accessibility

- Prioritize quick scanning on mobile: clear categories, readable prices, useful product descriptions, and appropriately sized photos.
- Include a visible location and confirmed operating hours; provide links to map and social profiles only when the client confirms them.
- Give images meaningful alt text, maintain sufficient color contrast, and ensure controls work with keyboard and touch.
- Use responsive image sizes and modern formats where possible. Avoid loading large full-resolution photos into small mobile cards.
- Consider a web manifest / add-to-home-screen support after the core site is stable. Push notifications are not needed for a menu catalog.

## Launch and Handoff Checklist

- [ ] Receive and verify the final menu, prices, categories, product photos, cafe details, and logo.
- [ ] Confirm spelling, descriptions, prices, availability, location, hours, and social URLs with the client.
- [ ] Replace every mock item and placeholder image with approved content.
- [ ] Test mobile and desktop layouts, keyboard navigation, accessibility basics, image loading, and empty/unavailable states.
- [ ] Test that publishing content in Sanity triggers a successful website deployment.
- [ ] Test that a failed build does not replace the previous live site.
- [ ] Review current Sanity and Cloudflare quotas, terms, and commercial-use rules.
- [ ] Confirm the production URL and account ownership with the client.
- [ ] Share the live URL and a concise guide for updating and publishing the menu.
- [ ] Agree on who handles future content updates, dependency maintenance, and deployment failures.
- [ ] Add the PWA manifest only if it adds value after launch requirements are met.

## Assumptions and Future Changes

This plan is for a product catalog, not a point-of-sale system. It does not include online ordering, payments, customer accounts, inventory synchronization, or real-time availability. Those features change the security, support, and hosting requirements and should be scoped separately before implementation.

If the client needs changes to appear immediately without a static rebuild, evaluate a server-rendered or on-demand revalidation architecture and its hosting limits and costs before changing the current design.
