import assert from "node:assert/strict";
import test from "node:test";

const typesModule = await import("../src/types/config.ts").catch(() => null);
const configModule = await import("../src/config.ts").catch(() => null);

test("resolves defaults for optional site settings", () => {
  assert.ok(typesModule, "the site config types and resolver module must exist");

  const resolved = typesModule.resolveSiteConfig({
    site: {
      website: "https://example.com/",
      author: "Example Author",
      desc: "Example description",
      title: "Example Site",
    },
  });

  assert.deepEqual(resolved.posts, { perPage: 5, perIndex: 4 });
  assert.deepEqual(resolved.books, { perPage: 5, perIndex: 4 });
  assert.equal(resolved.features.lightAndDarkMode, true);
  assert.deepEqual(resolved.locale, { lang: "en", langTag: ["en-EN"] });
});

test("preserves independently configured post and book settings", () => {
  assert.ok(typesModule, "the site config types and resolver module must exist");

  const resolved = typesModule.resolveSiteConfig({
    site: {
      website: "https://example.com/",
      author: "Example Author",
      desc: "Example description",
      title: "Example Site",
    },
    posts: { perPage: 7, perIndex: 3 },
    books: { perPage: 9, perIndex: 2 },
  });

  assert.deepEqual(resolved.posts, { perPage: 7, perIndex: 3 });
  assert.deepEqual(resolved.books, { perPage: 9, perIndex: 2 });
});

test("src/config.ts exports only the resolved config object", () => {
  assert.ok(configModule, "src/config.ts must exist");

  assert.equal(
    Object.keys(configModule).sort().join(","),
    "default",
    "named compatibility exports must be removed"
  );

  const config = configModule.default;
  assert.equal(config.site.website, "https://rajendrasinh.com/");
  assert.equal(config.site.title, "Rajendrasinh Parmar");
  assert.deepEqual(config.posts, { perPage: 5, perIndex: 4 });
  assert.deepEqual(config.books, { perPage: 5, perIndex: 4 });
  assert.equal(config.features.lightAndDarkMode, true);
  assert.ok(Array.isArray(config.socials));
  assert.ok(config.socials.length > 0);
});
