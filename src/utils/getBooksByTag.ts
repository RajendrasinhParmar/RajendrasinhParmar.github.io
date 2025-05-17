import { slugifyAll } from "./slugify";
import type { CollectionEntry } from "astro:content";

const getBooksByTag = (books: CollectionEntry<"book">[], tag: string) =>
  books.filter(book => slugifyAll(book.data.tags).includes(tag));

export default getBooksByTag;
