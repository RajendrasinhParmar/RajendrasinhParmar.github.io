import type { CollectionEntry } from "astro:content";
import { filterPostByDraft } from "@utils/common";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) =>
  posts
    .filter(filterPostByDraft)
    .sort(
      (a, b) =>
        Math.floor(new Date(b.data.pubDatetime).getTime() / 1000) -
        Math.floor(new Date(a.data.pubDatetime).getTime() / 1000)
    );

export default getSortedPosts;
