import type { CollectionEntry } from "astro:content";
import { filterBookByDraft } from "@utils/common";

type SortOption = "date" | "rating" | "status";

const getSortedBooks = (
  books: CollectionEntry<"book">[],
  sortBy: SortOption = "date"
) => {
  const filteredBooks = books.filter(filterBookByDraft);

  switch (sortBy) {
    case "rating":
      return filteredBooks.sort((a, b) => {
        const ratingA = a.data.rating || 0;
        const ratingB = b.data.rating || 0;
        return ratingB - ratingA;
      });
    case "status":
      return filteredBooks.sort((a, b) => {
        const statusOrder = { reading: 0, "to-read": 1, completed: 2 };
        return statusOrder[a.data.status] - statusOrder[b.data.status];
      });
    case "date":
    default:
      return filteredBooks.sort(
        (a, b) =>
          Math.floor(new Date(b.data.pubDatetime).getTime() / 1000) -
          Math.floor(new Date(a.data.pubDatetime).getTime() / 1000)
      );
  }
};

export default getSortedBooks;
