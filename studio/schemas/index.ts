import { defineField, defineType } from "sanity";

const category = defineType({
  name: "category",
  title: "Menu category",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Category name",
      type: "string",
      validation: (rule) => rule.required().min(1).max(60),
    }),
    defineField({
      name: "description",
      title: "Short category note",
      type: "string",
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "name", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "active",
      title: "Show on menu",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: { select: { title: "name" } },
});

const menuItem = defineType({
  name: "menuItem",
  title: "Menu item",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Item name",
      type: "string",
      validation: (rule) => rule.required().min(1).max(80),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (PHP)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: "image",
      title: "Product photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Image description",
          type: "string",
          validation: (rule) => rule.required().max(160),
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured item",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "available",
      title: "Available",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category.name", media: "image" },
  },
});

const cafeInfo = defineType({
  name: "cafeInfo",
  title: "Cafe information",
  type: "document",
  fields: [
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "mapUrl",
      title: "Map link",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "menuDocument",
      title: "Approved public menu PDF",
      type: "file",
      description: "Optional public PDF only. Do not upload private or internal files.",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "hours",
      title: "Opening hours",
      type: "array",
      of: [
        defineField({
          name: "dayHours",
          title: "Day and hours",
          type: "object",
          fields: [
            defineField({
              name: "day",
              title: "Day",
              type: "string",
              options: {
                list: [
                  { title: "Monday", value: "monday" },
                  { title: "Tuesday", value: "tuesday" },
                  { title: "Wednesday", value: "wednesday" },
                  { title: "Thursday", value: "thursday" },
                  { title: "Friday", value: "friday" },
                  { title: "Saturday", value: "saturday" },
                  { title: "Sunday", value: "sunday" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "closed",
              title: "Closed all day",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "open",
              title: "Opens at",
              type: "string",
              description: "Use 24-hour time, for example 09:00.",
              hidden: ({ parent }) => Boolean(parent?.closed),
            }),
            defineField({
              name: "close",
              title: "Closes at",
              type: "string",
              description: "Use 24-hour time, for example 18:00.",
              hidden: ({ parent }) => Boolean(parent?.closed),
            }),
          ],
          preview: {
            select: { title: "day", open: "open", close: "close", closed: "closed" },
            prepare({ title, open, close, closed }) {
              return {
                title,
                subtitle: closed ? "Closed" : [open, close].filter(Boolean).join(" - "),
              };
            },
          },
        }),
      ],
    }),
    defineField({ name: "phone", title: "Phone number", type: "string" }),
    defineField({
      name: "facebookUrl",
      title: "Facebook page",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram page",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "tiktokUrl",
      title: "TikTok page",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "introduction",
      title: "Short introduction",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
  ],
  preview: { prepare: () => ({ title: "Cafe information" }) },
});

const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero headline",
      type: "text",
      rows: 2,
      description: "Main heading shown in the website hero. Use a new line to control the line break.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "menuHeading",
      title: "Menu section heading",
      type: "string",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "visitHeading",
      title: "Visit section heading",
      type: "string",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "cafeName",
      title: "Cafe name",
      type: "string",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "footerCopyright",
      title: "Footer copyright text",
      type: "string",
      description: "Optional custom copyright text. Leave blank to show the current year and cafe name automatically.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Image description",
          type: "string",
          validation: (rule) => rule.required().max(160),
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const schemaTypes = [category, menuItem, cafeInfo, siteSettings];