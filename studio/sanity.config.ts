import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "hey-cafe",
  title: "Hey! Cafe Content Studio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "755fh2p2",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});