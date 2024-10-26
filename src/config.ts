import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://rajendrasinh.com/", // replace this with your deployed domain
  author: "Rajendrasinh Parmar",
  desc: "A minimal, responsive and SEO-friendly Technology blog.",
  title: "Rajendrasinh Parmar",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 5,
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/RajendrasinhParmar",
    linkTitle: `${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/RAJENDRASINH.PARMAR/",
    linkTitle: `${SITE.title} on Facebook`,
    active: false,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/rajendrasinh207/",
    linkTitle: `${SITE.title} on Instagram`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/rajendrasinhparmar207/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:yourmail@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: false,
  },
  {
    name: "Twitter",
    href: "https://x.com/RAJENDRASINH_09",
    linkTitle: `${SITE.title} on Twitter`,
    active: false,
  },
  {
    name: "X",
    href: "https://x.com/RAJENDRASINH_09",
    linkTitle: `${SITE.title} on X`,
    active: true,
  },
  {
    name: "Twitch",
    href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
    linkTitle: `${SITE.title} on Twitch`,
    active: false,
  },
  {
    name: "YouTube",
    href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
    linkTitle: `${SITE.title} on YouTube`,
    active: false,
  },
  {
    name: "WhatsApp",
    href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
    linkTitle: `${SITE.title} on WhatsApp`,
    active: false,
  },
  {
    name: "Snapchat",
    href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
    linkTitle: `${SITE.title} on Snapchat`,
    active: false,
  },
  {
    name: "Pinterest",
    href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
    linkTitle: `${SITE.title} on Pinterest`,
    active: false,
  },
  {
    name: "TikTok",
    href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
    linkTitle: `${SITE.title} on TikTok`,
    active: false,
  },
  {
    name: "CodePen",
    href: "https://codepen.io/RajendrasinhParmar",
    linkTitle: `${SITE.title} on CodePen`,
    active: true,
  },
  {
    name: "Discord",
    href: "https://discordapp.com/users/869207299409969243",
    linkTitle: `${SITE.title} on Discord`,
    active: true,
  },
  {
    name: "GitLab",
    href: "https://gitlab.com/Rajendrasinh",
    linkTitle: `${SITE.title} on GitLab`,
    active: false,
  },
  {
    name: "Reddit",
    href: "https://www.reddit.com/user/Rajendrasinh_09/",
    linkTitle: `${SITE.title} on Reddit`,
    active: false,
  },
  {
    name: "Skype",
    href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
    linkTitle: `${SITE.title} on Skype`,
    active: false,
  },
  {
    name: "Steam",
    href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
    linkTitle: `${SITE.title} on Steam`,
    active: false,
  },
  {
    name: "Telegram",
    href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
    linkTitle: `${SITE.title} on Telegram`,
    active: false,
  },
  {
    name: "Mastodon",
    href: "https://github.com/RajendrasinhParmar/RajendrasinhParmar.github.io",
    linkTitle: `${SITE.title} on Mastodon`,
    active: false,
  },
];
