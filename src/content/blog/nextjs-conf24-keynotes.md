---
title: NextJS Conf24 keynotes
description: NextJS Conference keynotes Oct 2024
pubDatetime: 2024-10-24T22:59:50+05:30
postSlug: nextjs-conf24
featured: false
draft: false
tags:
  - NextJS
---

![NextJS Conf24 Ticket.png](@assets/images/nextjs-conf24-ticket.png)

[NextJS Conference Keynotes Oct 2024](https://nextjs.org/conf)

## Table of contents

## Introduction

Next.js Conf is a global conference for developers, enthusiasts, and industry leaders to connect with a community of NextJS builders, and hear from the Next.js team about how to build the best apps on the web. This year’s event is on October 24 in San Francisco and online everywhere. I am excited to be part of this event and share the keynotes with you.

## Keynotes

From the NextJS team, we have some exciting announcements and updates to share with you. Here are some of the keynotes from the conference. The main announcements in the keynotes revolve around the NextJS 15 release and the new features introduced in it. Along with new features in the core framework, there are some updates in the NextJS ecosystem.

## Turbopack Dev is Now Stable

Turbopack is now stable and ready to speed up the development experience. The command for that is `next dev --turbo`. This will enable the turbo mode for the development server and speed up the development experience. It is being used to iterate on [vercel.com](https://vercel.com), [nextjs.org](https://nextjs.org/), and [v0.dev](https://v0.dev/).

### highlights

- Faster initial compile of a route
- Faster Fast Refresh
- Advanced Tracing
- Less flakiness in compile times
- Development builds that closely match production

More details about the stable Turbopack dev can be found on [Turbopack Dev is Now Stable](https://nextjs.org/blog/turbopack-for-development-stable).

## Are we turbo yet?

### Development: Yes

- Dev Tests: 6599 passing of 6599

![Turbopack Dev is Now Stable](@assets/images/nextjs-dev-tests.png)

### Production: No

- Production Tests: 6822 of 7108 next build tests passing (286 left for 100%)

![Turbopack build](@assets/images/nextjs-build-tests.png)

## Caching Improvements

### `use cache` directive

Next.js improves the application's performance and reduces costs by caching rendering work and data requests.

In the keynote, the NextJS team announced mainly the `'use cache'` directive and how it can be used in different parts of the application.

- On the main page of the route where we usually write `'use client'` or `'use server'` we can now use `'use cache'` to cache the data.

- In the child components, we can use `'use cache'` to cache the component and later they can directly use the cached data.

- In the API routes, we can use `'use cache'` to cache the data and reduce the load on the server.

### cacheTag and cacheLife

- Apart from the `'use cache'`, there are two new properties introduced `cacheTag` and `cacheLife`. This can be used to tag the cache and set the life of the cache.

```js
import {
  unstable_cacheTag as cacheTag,
  unstable_cacheLife as cacheLife,
} from 'next/cache'

interface BookingsProps {
  type: string
}

export async function Bookings({ type = 'massage' }: BookingsProps) {
  'use cache'
  cacheLife('minutes')
  cacheTag('bookings-data')

  async function getBookingsData() {
    const data = await fetch(`/api/bookings?type=${encodeURIComponent(type)}`)
    return data
 }

  return //...
}
```

### revalidateTag

We can invalidate the cache for a specific tag using the `revalidateTag` method.

```js
"use server";

import { revalidateTag } from "next/cache";

revalidateTag("bookings-data");
```

## New versioned docs

The NextJS team has introduced versioned docs for the NextJS framework. This will help the developers to refer to the specific version of the documentation and build the application accordingly. The versioned docs can be accessed at [nextjs.org/docs](https://nextjs.org/docs).

![NextJS Versioned Docs](@assets/images/nextjs-versioned-docs.png)

## Self-Hosting Next.js

The Nextjs team has introduced features and configurations to self-host the NextJS application. This will help the developers to host the NextJS application on their own servers and manage the application as per their requirements.

There is a reference repository for self-hosting the NextJS application at [Next-self-host](https://github.com/leerob/next-self-host).

## Conclusion

These are some of the keynotes from the NextJS conference. The NextJS team has introduced some exciting features and updates in the NextJS 15 release. The new features will help the developers to build the applications faster and more efficiently. I am excited to try out the new features and build some amazing applications with NextJS.
