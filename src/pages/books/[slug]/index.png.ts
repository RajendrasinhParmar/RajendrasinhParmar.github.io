import { isDev } from "@utils/common";
import { generateOgImageForBook } from "@utils/generateOgImages";
import slugify from "@utils/slugify";
import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export async function getStaticPaths() {
  const books = await getCollection("book").then(b =>
    b.filter(({ data }) => (isDev || !data.draft) && !data.ogImage)
  );

  return books.map(book => ({
    params: { slug: slugify(book.data) },
    props: book,
  }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await generateOgImageForBook(props as CollectionEntry<"book">), {
    headers: { "Content-Type": "image/png" },
  });
