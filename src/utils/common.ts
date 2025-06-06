import type { CollectionEntry } from "astro:content";

export const isDev = import.meta.env.MODE === "development";

export const filterPostByDraft = ({ data }: CollectionEntry<"blog">) => {
  if (isDev) {
    return true;
  }

  return !data.draft;
};

export const filterBookByDraft = ({ data }: CollectionEntry<"book">) => {
  if (isDev) {
    return true;
  }

  return !data.draft;
};
