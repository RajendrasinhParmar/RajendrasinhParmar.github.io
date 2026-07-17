import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeMermaid from "rehype-mermaid";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import siteConfig from "./site.config";
import rehypeImageCredits from "./src/utils/rehypeImageCredits";
import remarkExternalLinks from "./src/utils/remarkExternalLinks";
import remarkImageCredits from "./src/utils/remarkImageCredits";

// https://astro.build/config
export default defineConfig({
  site: siteConfig.site.website,
  integrations: [sitemap()],
  markdown: {
    // Astro v7 defaults to Sätteri; keep unified() for remark/rehype plugins.
    processor: unified({
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
            // Use pre-mermaid (client-side) so build doesn't rely on Playwright.
            // img-svg/inline-svg use Playwright and can fail on macOS, leaving post body empty.
            strategy: "pre-mermaid",
          },
        ],
        rehypeImageCredits,
      ],
    }),
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    syntaxHighlight: {
      excludeLangs: ["mermaid"],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
});
