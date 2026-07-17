import { defineSiteConfig } from "./src/types/config.ts";

const SITE_TITLE = "Rajendrasinh Parmar";

export default defineSiteConfig({
  site: {
    website: "https://rajendrasinh.com/",
    author: "Rajendrasinh Parmar",
    desc: "A minimal, responsive and SEO-friendly Technology blog.",
    title: SITE_TITLE,
    ogImage: "astropaper-og.jpg",
  },
  posts: {
    perPage: 5,
    perIndex: 4,
  },
  books: {
    perPage: 5,
    perIndex: 4,
  },
  features: {
    lightAndDarkMode: true,
  },
  locale: {
    lang: "en",
    langTag: ["en-EN"],
  },
  logo: {
    enable: false,
    svg: true,
    width: 216,
    height: 46,
  },
  socials: [
    {
      name: "Github",
      href: "https://github.com/RajendrasinhParmar",
      linkTitle: `${SITE_TITLE} on Github`,
      active: true,
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/RAJENDRASINH.PARMAR/",
      linkTitle: `${SITE_TITLE} on Facebook`,
      active: false,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/rajendrasinh207/",
      linkTitle: `${SITE_TITLE} on Instagram`,
      active: true,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/rajendrasinhparmar207/",
      linkTitle: `${SITE_TITLE} on LinkedIn`,
      active: true,
    },
    {
      name: "Mail",
      href: "mailto:yourmail@gmail.com",
      linkTitle: `Send an email to ${SITE_TITLE}`,
      active: false,
    },
    {
      name: "Twitter",
      href: "https://x.com/RAJENDRASINH_09",
      linkTitle: `${SITE_TITLE} on Twitter`,
      active: false,
    },
    {
      name: "X",
      href: "https://x.com/RAJENDRASINH_09",
      linkTitle: `${SITE_TITLE} on X`,
      active: true,
    },
    {
      name: "Twitch",
      href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
      linkTitle: `${SITE_TITLE} on Twitch`,
      active: false,
    },
    {
      name: "YouTube",
      href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
      linkTitle: `${SITE_TITLE} on YouTube`,
      active: false,
    },
    {
      name: "WhatsApp",
      href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
      linkTitle: `${SITE_TITLE} on WhatsApp`,
      active: false,
    },
    {
      name: "Snapchat",
      href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
      linkTitle: `${SITE_TITLE} on Snapchat`,
      active: false,
    },
    {
      name: "Pinterest",
      href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
      linkTitle: `${SITE_TITLE} on Pinterest`,
      active: false,
    },
    {
      name: "TikTok",
      href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
      linkTitle: `${SITE_TITLE} on TikTok`,
      active: false,
    },
    {
      name: "CodePen",
      href: "https://codepen.io/RajendrasinhParmar",
      linkTitle: `${SITE_TITLE} on CodePen`,
      active: true,
    },
    {
      name: "Discord",
      href: "https://discordapp.com/users/869207299409969243",
      linkTitle: `${SITE_TITLE} on Discord`,
      active: true,
    },
    {
      name: "GitLab",
      href: "https://gitlab.com/Rajendrasinh",
      linkTitle: `${SITE_TITLE} on GitLab`,
      active: false,
    },
    {
      name: "Reddit",
      href: "https://www.reddit.com/user/Rajendrasinh_09/",
      linkTitle: `${SITE_TITLE} on Reddit`,
      active: false,
    },
    {
      name: "Skype",
      href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
      linkTitle: `${SITE_TITLE} on Skype`,
      active: false,
    },
    {
      name: "Steam",
      href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
      linkTitle: `${SITE_TITLE} on Steam`,
      active: false,
    },
    {
      name: "Telegram",
      href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
      linkTitle: `${SITE_TITLE} on Telegram`,
      active: false,
    },
    {
      name: "Mastodon",
      href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
      linkTitle: `${SITE_TITLE} on Mastodon`,
      active: false,
    },
  ],
});
