---
title: Poetry - Updating a package to a new version
description: Update the Python module to the latest version with poetry
pubDatetime: 2025-06-21T17:21:20+05:30
postSlug: poetry---updating-a-package-to-a-new-version
featured: false
draft: false
tags:
  - poetry
  - python
---

![tp.web.random_picture](https://images.unsplash.com/photo-1649180556628-9ba704115795?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8dHJlZSxsYW5kc2NhcGUsd2F0ZXJ8fHx8fHwxNzE1MjI3OTE5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900)

Update the Python module to the latest version with poetry.

## Table of contents

## TL;DR

If you want to update the package to the latest or a specific version, use the following command.

```bash
$ poetry add <package-name>@<version>

# or

$ poetry add <package-name>@latest
```

## Issue

I am using poetry to manage a few of my Python projects. Recently I had to update the `mysql-connector-python` package to the latest version.

I found the following command to update the package to the latest version.

```bash
poetry update <package-name>
```

However, it didn't work properly and it showed the following message.

```bash
$ poetry update mysql-connector-python

# Updating dependencies
# Resolving dependencies... (1.0s)

# No dependencies to install or update
```

## Solution

After some research, I found the following command to update the package to the latest version. And the command is not actually `update` but `add` with the latest or specific version.

### Update the package to the latest version

```bash
$ poetry add mysql-connector-python@latest
```

It worked and updated the package to the latest version.

### Update the package to a specific version

```bash
$ poetry add mysql-connector-python==9.3.0
```

It worked and updated the package to the specific version.

## Conclusion

We can use the following command to update the package to the latest or a specific version.

```bash
$ poetry add <package-name>@<version>
```
