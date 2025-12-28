import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import rehypeMermaid from "rehype-mermaid";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import { SITE } from "./src/config";
import rehypeImageCredits from "./src/utils/rehypeImageCredits";
import remarkExternalLinks from "./src/utils/remarkExternalLinks";
import remarkImageCredits from "./src/utils/remarkImageCredits";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
      remarkExternalLinks,
      remarkImageCredits,
    ],
    rehypePlugins: [
      [
        rehypeMermaid,
        {
          strategy: "img-svg",
        },
      ],
      rehypeImageCredits,
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    syntaxHighlight: {
      excludeLangs: ["mermaid"],
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
});
