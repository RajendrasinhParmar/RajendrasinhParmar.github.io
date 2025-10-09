---
title: Upgrading Husky from v8 to v9
description: Complete guide to migrate Husky from version 8 to 9 with improved TypeScript support, faster hooks, and simplified configuration
pubDatetime: 2025-10-09T18:09:47+05:30
postSlug: upgrade-from-husky-v8-to-v9
featured: false
draft: false
tags:
  - nodejs
  - husky
  - git
  - hooks
  - DevOps
---

![Yancy Min (https://unsplash.com/@yancymin?utm_source=templater_proxy&utm_medium=referral) on Unsplash](https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900&h=350)

## Table of contents

## TL;DR

If your project is already on **Husky v8**, upgrading to **v9** mainly involves updating the package, ensuring your hook scripts follow the new `.husky/` directory structure, and removing deprecated configurations from `package.json`.

_Note: I am using npm as package manager in this example but the steps are the same for other package managers as well._

```bash
# Quick upgrade steps
$ npm install husky@^9 --save-dev
$ npx husky

# Remove old package.json hook configs if any, and create new hook files
$ rm -rf .husky/pre-commit .husky/pre-push .husky/commit-msg
$ echo "npm run lint-staged" > .husky/pre-commit
$ echo "npm test" > .husky/pre-push
$ echo "npm run commitlint" > .husky/commit-msg
$ chmod +x .husky/*
# the scripts that we are executing in the hooks should be avaialble in package.json scripts
```

**Key Benefits:** Improved Performance, Smaller Footprint, Better Shell Script Handling, Modern Architecture.

## Introduction

Husky is the go-to tool for managing Git hooks in JavaScript and TypeScript projects. It allows teams to automate code checks (linting, testing, formatting) before commits or pushes, helping maintain clean and consistent repositories.

## Why upgrade?

Here are the key benefits of moving from v8 to v9:

- **Improved Performance** — v9 offers faster hook execution
- **Smaller Footprint** — Reduced installation size. Just 2 kB (📦 gzipped) with no dependencies
- **Better Shell Script Handling** — More reliable script execution. no more crashing due to different shell implementations
- **Modern Architecture** — Aligned with current best practices

## Migration Steps

### 1. Update Husky

```bash
$ npm install husky@^9 --save-dev
$ npx husky --version  # Verify installation
```

### 2. Update package.json

Remove the old `husky` configuration and update the prepare script:

```json
{
  "scripts": {
    "prepare": "husky",
    "lint-staged": "lint-staged",
    "test": "test",
    "commitlint": "commitlint"
  }
  // Remove any "husky" object with hooks
}
```

### 3. Create Hook Files

Replace old JSON configuration with individual script files:

```bash
$ echo "npm run lint-staged" > .husky/pre-commit
$ echo "npm test" > .husky/pre-push
$ echo "npm run commitlint --edit \$1" > .husky/commit-msg
$ chmod +x .husky/*
```

### 4. Test Your Setup

```bash
$ git commit -m "test: husky v9 migration"
```

If hooks run successfully, you're done!

## Before vs After

**Husky v8 (Old):**

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  }
}
```

**Husky v9 (New):**

```bash
# .husky/pre-commit
npm run lint-staged

# .husky/pre-push
npm test
```

**Key Changes:**

- No more JSON configuration in `package.json`
- Individual script files in `.husky/` directory
- Simpler and more maintainable

## Troubleshooting

| Issue                   | Fix                                         |
| ----------------------- | ------------------------------------------- |
| Hooks not running       | Run `npx husky` and `chmod +x .husky/*`     |
| Permission denied       | `chmod +x .husky/*`                         |
| Old config still loaded | Remove `"husky"` object from `package.json` |

## Conclusion

Upgrading Husky from version 8 to version 9 is straightforward and brings performance improvements, a smaller footprint, and improved reliability. The new file-based approach is cleaner and easier to maintain than the old JSON configuration.

The migration takes just a few minutes but ensures your project stays modern and compatible with current JavaScript tooling standards.
