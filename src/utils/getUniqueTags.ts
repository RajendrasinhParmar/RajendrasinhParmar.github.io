import { filterBookByDraft, filterPostByDraft } from "@utils/common";
import { slugifyStr } from "./slugify";
import type { CollectionEntry } from "astro:content";

const getUniqueTags = (
  posts: CollectionEntry<"blog">[] = [],
  books: CollectionEntry<"book">[] = []
) => {
  const filteredPosts = posts.filter(filterPostByDraft);
  const filteredBooks = books.filter(filterBookByDraft);

  const tags: string[] = filteredPosts
    .flatMap(post => post.data.tags)
    .concat(filteredBooks.flatMap(book => book.data.tags))
    .map(tag => slugifyStr(tag))
    .filter(
      (value: string, index: number, self: string[]) =>
        self.indexOf(value) === index
    )
    .sort((tagA: string, tagB: string) => tagA.localeCompare(tagB));
  return tags;
};

export default getUniqueTags;
