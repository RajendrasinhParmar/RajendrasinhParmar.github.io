import config from "@config";

const getPageNumbers = (
  numberOfEntries: number,
  perPage: number = config.posts.perPage
) => {
  const numberOfPages = numberOfEntries / perPage;

  let pageNumbers: number[] = [];
  for (let i = 1; i <= Math.ceil(numberOfPages); i++) {
    pageNumbers = [...pageNumbers, i];
  }

  return pageNumbers;
};

export default getPageNumbers;
