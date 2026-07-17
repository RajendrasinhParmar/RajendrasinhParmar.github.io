/**
 * Internal resolved configuration used throughout the site.
 *
 * Prefer editing `site.config.ts` instead of this file. This module exists to
 * apply defaults and expose a fully-resolved config shape (`ResolvedSiteConfig`).
 */
import userConfig from "../site.config.ts";
import { resolveSiteConfig } from "./types/config.ts";

const config = resolveSiteConfig(userConfig);

export default config;
