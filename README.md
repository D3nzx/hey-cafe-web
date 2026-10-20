# Hey! Cafe Website

Mobile-first menu and cafe information website for Hey! Cafe. No online ordering or payments.

A mobile-first cafe menu and information site with a separate Sanity content editor. Menu items, categories, cafe details, branding, images, and an optional public menu PDF are managed in the Studio rather than edited in the website code.

## Content intake workflow

- The client uploads approved menu items, prices, product photos, branding assets, and cafe information to a shared Google Drive folder.
- The developer reviews the assets and imports them into Sanity using a validated workflow or enters them directly when the CMS is ready.
- A cafe editor reviews the draft content in Sanity Studio and publishes the approved version.
- A Sanity publish event triggers the Cloudflare Pages deployment, which rebuilds the public site with the latest approved content.
- Placeholder products, categories, and imagery remain clearly labeled until the cafe supplies and approves final content.

The initial category placeholders include Espresso, Signature Drinks, Non-Coffee, and Pastries. These are sample placeholders only and must be replaced with the final confirmed categories before launch.

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

## Secure publish webhook flow

This project uses a static export, so the publish hook should be handled by Cloudflare Pages Functions rather than a Next.js API route. The Cloudflare Pages function at `functions/sanity-webhook.js` verifies the Sanity webhook HMAC, and then triggers the project deploy hook. This keeps the secret out of the browser and avoids breaking the static build.

### Required environment values

Set these in the Cloudflare Pages project environment variables and keep them out of GitHub:

```bash
SANITY_WEBHOOK_SECRET=replace-with-a-long-random-secret
CLOUDFLARE_DEPLOY_HOOK_URL=https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/your-hook-id
```

### Sanity configuration

1. In Sanity, open the project and go to Project settings > Webhooks.
2. Create a new webhook for the `main` branch or the production branch you want to deploy.
3. Paste the Cloudflare deploy hook URL into the webhook target.
4. Set the webhook secret to the same value used for `SANITY_WEBHOOK_SECRET`.
5. Choose the event that should trigger deployment (typically document publish events for the live dataset).
6. Use a test document to publish a draft, then review the deployment logs.

### Recovery behavior

Cloudflare Pages keeps the last successful deployment live until a new build passes. That means a failed build does not replace the previous public site. After your Sanity publish event runs, verify in Cloudflare that the new deployment either succeeds or leaves the earlier build in place.

### Local validation

The signature-verification helper in `src/lib/sanity-webhook.ts` is ready for test coverage and can be used to validate the same HMAC method Sanity sends.

## Launch and handoff checklist

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

## Remaining integration work

Connect the Studio to the cafe-owned project and test sign-in, image/PDF uploads, publishing, and the public query with approved test content. Then configure static export, hosting, publishing-triggered builds, and the production handoff. Keep the fictional fixtures clearly labeled until the cafe supplies and approves its content.
