# Hey! Cafe Website — Handoff Guide

**Prepared by:** Denziel Capangpangan  
**Date:** October 21, 2026  
**For:** Hey! Cafe, Yati, Liloan, Cebu

---

## Your Website

**Live site:** https://hey-cafe-web.pages.dev

This is your public menu and cafe information page. Customers can browse it on any phone or computer. No login is needed to view it.

---

## Your Content Editor (Sanity Studio)

**Studio URL:** https://hey-cafe.sanity.studio

This is where you add, edit, and publish your menu items, categories, prices, photos, and cafe details. You manage everything here — no code editing required.

---

## How to Sign In

1. Go to https://hey-cafe.sanity.studio
2. Click **"Continue with Google"**
3. Sign in using the cafe Gmail account:  
   **`heycafe.liloan.official@gmail.com`**
4. You will land on the Studio dashboard

> Keep the cafe Gmail password in a safe place (a password manager is recommended). Do not share it in chat messages or text.

---

## How to Add a Menu Category

1. In the left sidebar, click **"Menu Category"**
2. Click the **pencil / edit icon** or **"+ New"** button
3. Fill in:
   - **Name** — e.g. `Espresso`, `Signature Drinks`, `Non-Coffee`, `Pastries`
   - **Slug** — click "Generate" to auto-fill from the name
   - **Display Order** — controls the order categories appear on the site (lower number = appears first)
   - **Active** — toggle on to make the category visible
4. Click **"Publish"** in the bottom right

---

## How to Add a Menu Item

1. In the left sidebar, click **"Menu Item"**
2. Click **"+ New"**
3. Fill in:
   - **Name** — the item name as it should appear on the site
   - **Slug** — click "Generate"
   - **Category** — pick the matching category from the dropdown
   - **Price (PHP)** — enter the number only, e.g. `120`
   - **Description** — a short one-line description (optional but recommended)
   - **Image** — click to upload a product photo (see photo tips below)
   - **Image Alt Text** — describe the photo briefly, e.g. `Iced caramel latte in a tall glass`
   - **Available** — toggle on if the item is currently for sale
   - **Featured** — toggle on for best-sellers or highlighted items
   - **Display Order** — controls order within the category
4. Click **"Publish"** in the bottom right

After publishing, the live website will automatically rebuild and show the new item within a few minutes.

---

## How to Edit or Remove a Menu Item

- **Edit:** Click the item name in the list, make your changes, then click **"Publish"**
- **Unpublish (hide without deleting):** Open the item, click the arrow next to "Publish", choose **"Unpublish"**
- **Delete:** Open the item, click the three-dot menu (`⋯`) in the top right, choose **"Delete"**

Always publish or unpublish rather than leaving items in draft if you want changes to appear (or disappear) on the live site.

---

## Photo Tips

- Use a clear, well-lit photo of the item
- Square or slightly portrait photos work best
- Minimum recommended size: **800 × 800 px**
- Accepted formats: JPG, PNG, WebP
- Always fill in the **Image Alt Text** field — this helps customers using screen readers and improves search visibility

---

## How Updates Appear on the Live Site

Publishing in Sanity Studio automatically triggers a rebuild of the live website. The update usually appears within **2–5 minutes**. If it takes longer, try refreshing the live site after a few minutes.

If you unpublish or delete content, the site rebuilds and that content is removed — also within a few minutes.

---

## Optional: Public Menu PDF

You can upload a PDF version of your menu for customers to download. In the Studio, go to **"Site Settings"** and upload the file in the **"Menu PDF"** field, then publish. Only upload a file you are happy for the public to download.

---

## Who to Contact for Technical Support

For any technical issues with the website, build failures, or account access problems:

**Denziel Capangpangan**  
GitHub: [D3nzx](https://github.com/D3nzx)

Reach out before making any changes to Cloudflare, GitHub, or Sanity project settings to avoid accidental downtime.

---

## Quick Reference

| What | Where |
|---|---|
| Live site | https://hey-cafe-web.pages.dev |
| Content editor | https://hey-cafe.sanity.studio |
| Sign-in account | heycafe.liloan.official@gmail.com |
| Hosting (Cloudflare Pages) | https://dash.cloudflare.com |
| Source code (GitHub) | https://github.com/D3nzx/hey-cafe-web |

---

## Important Reminders

- **Do not publish personal, private, or internal documents** to the Studio. Only approved public menu and cafe information should be published.
- **All prices, photos, and descriptions on the site are visible to the public** the moment they are published.
- The website currently uses **free hosting plans** from Sanity and Cloudflare. There is no monthly fee at current usage levels. If limits change in future, we will discuss before any costs are incurred.
- A **custom domain** (e.g. `heycafe.com`) is optional and not included in the current setup. It can be added later if desired.
