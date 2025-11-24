import { getReadingTime } from "@utils/getReadingTime";
import { slugifyStr } from "@utils/slugify";
import type { CollectionEntry } from "astro:content";
import Datetime from "./Datetime";
import ReadingTime from "./ReadingTime";

export interface Props {
  href?: string;
  post?: CollectionEntry<"blog" | "book">;
  frontmatter?: CollectionEntry<"blog" | "book">["data"];
  secHeading?: boolean;
}

export default function Card({
  href,
  post,
  frontmatter,
  secHeading = true,
}: Props) {
  // Support both old (frontmatter) and new (post) API for backward compatibility
  const data = post?.data || frontmatter;
  if (!data) return null;

  const { title, pubDatetime, description } = data;
  const readingTime = post?.body ? getReadingTime(post.body) : undefined;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium decoration-dashed hover:underline",
  };

  return (
    <li className="my-6">
      <a
        href={href}
        className="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
      </a>
      <div className="flex flex-wrap items-center gap-4">
        <Datetime datetime={pubDatetime} />
        {readingTime && <ReadingTime minutes={readingTime} />}
      </div>
      <p>{description}</p>
    </li>
  );
}
