# Hey! Cafe Website

Mobile-first menu and cafe information website for Hey! Cafe. No online ordering or payments.

A mobile-first cafe menu and information site with a separate Sanity content editor. Menu items, categories, cafe details, branding, images, and an optional public menu PDF are managed in the Studio rather than edited in the website code.

## Current state

- Without a Sanity project ID, the public page remains a concept preview with clearly fictional local sample content.
- When configured, the public build queries published menu, cafe details, settings, and images from Sanity.
- The Sanity Studio schema is prepared for menu categories, menu items, cafe information, and site settings.
- The Studio and live query still need to be connected to a Sanity project. Create the project under the cafe's ownership before entering real business content.
- `npm run build` creates a static site in `out/` for the planned Cloudflare Pages deployment.
- Do not upload private or internal files to the public content dataset. Only publish approved business information and assets.

## Run the website

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

To query Sanity during local development or a build, copy `.env.example` to `.env.local` and enter the cafe-owned project ID. The public project ID, dataset, and API version are configuration values, not secrets. Do not add a write token to the website.

## Run the content editor

1. Create a Sanity project owned by the cafe and create a `production` dataset.
2. Copy `studio/.env.example` to `studio/.env` and set the cafe-owned project ID.
3. Run `npm run studio` and open `http://localhost:3333`.
4. Sign in with an account invited to the cafe's Sanity project.

The Studio supports image uploads for menu items and the logo, plus an optional PDF field for an approved public menu. Do not put a write token in the website or commit project credentials.

## Remaining integration work

Connect the Studio to the cafe-owned project and test sign-in, image/PDF uploads, publishing, and the public query with approved test content. Then configure static export, hosting, publishing-triggered builds, and the production handoff. Keep the fictional fixtures clearly labeled until the cafe supplies and approves its content.
