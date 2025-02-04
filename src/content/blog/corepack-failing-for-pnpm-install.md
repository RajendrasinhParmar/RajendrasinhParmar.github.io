---
title: Fixing Corepack Signature Validation Error with pnpm in Docker
description: How to resolve the Corepack signature validation error when using pnpm install in Docker builds
pubDatetime: 2025-02-04T01:05:43+05:30
postSlug: corepack-failing-for-pnpm-install
featured: false
draft: false
tags:
  - pnpm
  - corepack
  - Docker
---

![Corepack on docker](@assets/images/docker_corepack.webp)

Learn how to fix the Corepack signature validation error that occurs when using pnpm install during Docker builds.

## Table of contents

## TL;DR

If you're encountering a Corepack signature validation error, follow these steps:

1. Get the npm registry keys:

```bash
$ curl https://registry.npmjs.org/-/npm/v1/keys | jq -c '{npm: .keys}'
```

2. Add the keys to your Dockerfile as an environment variable:

```dockerfile
ENV COREPACK_INTEGRITY_KEYS='{"npm":[...keys output from step 1...]}'
```

3. Rebuild your Docker image:

```bash
docker build -t my-image .
```

## Understanding the Problem

When building a Docker image that uses pnpm with Corepack, you might encounter this error:

```bash
Error: Cannot find matching keyid: {"signatures":[{"sig":"MEQCIHGqHbvc2zImUPEPFpT4grh6rMYslel+lAjFArx8+RUdAiBfnJA+bgmUvO5Lctfkq+46KKDQdx/8RhLPge3pA+EdHA==","keyid":"SHA256:DhQ8wR5APBvFHLF/+Tc+AYvPOdTpcIDqOhxsBHRwC7U"}],"keys":[{"expires":null,"keyid":"SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA","keytype":"ecdsa-sha2-nistp256","scheme":"ecdsa-sha2-nistp256","key":"MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1Olb3zMAFFxXKHiIkQO5cJ3Yhl5i6UPp+IhuteBJbuHcA5UogKo0EWtlWwW6KSaKoTNEYL7JlCQiVnkhBktUgg=="}]}
```

This error occurs because Corepack cannot validate the signature of the package manager it's trying to install.

## Project Context

In this example, we're working with:

- A Node.js project using Express backend and Vite + React frontend
- pnpm as the package manager
- Docker for containerization
- Node.js 22 Alpine as the base image

## Initial Setup

Here's the Dockerfile that triggers the error:

```dockerfile
FROM node:22-alpine3.21 AS builder

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rest of the docker build steps
```

## Detailed Solution

### 1. Retrieve Registry Keys

First, fetch the current npm registry keys:

```bash
curl https://registry.npmjs.org/-/npm/v1/keys | jq -c '{npm: .keys}'
```

This command returns a JSON object containing the necessary validation keys.

### 2. Update Dockerfile

Modify your Dockerfile to include the integrity keys:

```dockerfile
FROM node:22-alpine3.21 AS builder

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set the integrity keys
ENV COREPACK_INTEGRITY_KEYS='{"npm":[{"expires":"2025-01-29T00:00:00.000Z","keyid":"SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA","keytype":"ecdsa-sha2-nistp256","scheme":"ecdsa-sha2-nistp256","key":"MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1Olb3zMAFFxXKHiIkQO5cJ3Yhl5i6UPp+IhuteBJbuHcA5UogKo0EWtlWwW6KSaKoTNEYL7JlCQiVnkhBktUgg=="},{"expires":null,"keyid":"SHA256:DhQ8wR5APBvFHLF/+Tc+AYvPOdTpcIDqOhxsBHRwC7U","keytype":"ecdsa-sha2-nistp256","scheme":"ecdsa-sha2-nistp256","key":"MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEY6Ya7W++7aUPzvMTrezH6Ycx3c+HOKYCcNGybJZSCJq/fd7Qa8uuAKtdIkUQtQiEKERhAmE5lMMJhP8OkDOa2g=="}]}'

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rest of the docker build steps
```

### 3. Build the Image

With the updated Dockerfile, rebuild your image:

```bash
docker build -t my-image .
```

The build should now complete successfully.

## Additional Information

Corepack is a built-in tool in Node.js 20 and above that manages package managers like pnpm, yarn, and bun. The signature validation error occurs when Corepack cannot verify the authenticity of the package manager it's trying to install.

## References

- [pnpm Issue #9029: Cannot install pnpm with corepack](https://github.com/pnpm/pnpm/issues/9029)
- [Corepack Issue #612: Package manager installation key mismatch](https://github.com/nodejs/corepack/issues/612)
- [pnpm Issue #9014: pnpm 10.1.0 installation fails on Windows](https://github.com/pnpm/pnpm/issues/9014)
