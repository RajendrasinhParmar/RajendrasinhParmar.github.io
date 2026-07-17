import type { SocialObjects } from "../types";

export interface SiteDetailsConfig {
  website: string;
  author: string;
  desc: string;
  title: string;
  ogImage?: string;
}

export interface CollectionDisplayConfig {
  perPage?: number;
  perIndex?: number;
}

export interface FeaturesConfig {
  lightAndDarkMode?: boolean;
}

export interface LocaleConfig {
  lang?: string;
  langTag?: string[];
}

export interface LogoImageConfig {
  enable?: boolean;
  svg?: boolean;
  width?: number;
  height?: number;
}

export interface SiteConfig {
  site: SiteDetailsConfig;
  posts?: CollectionDisplayConfig;
  books?: CollectionDisplayConfig;
  features?: FeaturesConfig;
  locale?: LocaleConfig;
  logo?: LogoImageConfig;
  socials?: SocialObjects;
}

export interface ResolvedSiteConfig {
  site: Required<SiteDetailsConfig>;
  posts: Required<CollectionDisplayConfig>;
  books: Required<CollectionDisplayConfig>;
  features: Required<FeaturesConfig>;
  locale: Required<LocaleConfig>;
  logo: Required<LogoImageConfig>;
  socials: SocialObjects;
}

const DEFAULT_OG_IMAGE = "astropaper-og.jpg";
const DEFAULT_COLLECTION_DISPLAY = {
  perPage: 5,
  perIndex: 4,
} as const;

export function defineSiteConfig(config: SiteConfig): SiteConfig {
  return config;
}

export function resolveSiteConfig(config: SiteConfig): ResolvedSiteConfig {
  return {
    site: {
      ...config.site,
      ogImage: config.site.ogImage ?? DEFAULT_OG_IMAGE,
    },
    posts: {
      perPage: config.posts?.perPage ?? DEFAULT_COLLECTION_DISPLAY.perPage,
      perIndex: config.posts?.perIndex ?? DEFAULT_COLLECTION_DISPLAY.perIndex,
    },
    books: {
      perPage: config.books?.perPage ?? DEFAULT_COLLECTION_DISPLAY.perPage,
      perIndex: config.books?.perIndex ?? DEFAULT_COLLECTION_DISPLAY.perIndex,
    },
    features: {
      lightAndDarkMode: config.features?.lightAndDarkMode ?? true,
    },
    locale: {
      lang: config.locale?.lang ?? "en",
      langTag: config.locale?.langTag ?? ["en-EN"],
    },
    logo: {
      enable: config.logo?.enable ?? false,
      svg: config.logo?.svg ?? true,
      width: config.logo?.width ?? 216,
      height: config.logo?.height ?? 46,
    },
    socials: config.socials ?? [],
  };
}
