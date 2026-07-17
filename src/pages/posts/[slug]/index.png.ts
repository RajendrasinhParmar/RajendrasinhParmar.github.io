import { isDev } from "@utils/common";
import { generateOgImageForPost } from "@utils/generateOgImages";
import slugify from "@utils/slugify";
import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("posts").then(p =>
    p.filter(({ data }) => (isDev || !data.draft) && !data.ogImage)
  );

  return posts.map(post => ({
    params: { slug: slugify(post.data) },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(
    await generateOgImageForPost(props as CollectionEntry<"posts">),
    {
      headers: { "Content-Type": "image/png" },
    }
  );
