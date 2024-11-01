---
title: Useful Linux Commands
description: useful linux commands that can help easily achieve basic tasks and information
pubDatetime: 2024-11-01T16:59:24+05:30
postSlug: useful-linux-commands
featured: false
draft: false
tags:
  - linux
---

![tp.web.random_picture](https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900&h=350)

useful linux commands

## Table of contents

## System Information

### Get current system Architecture

```bash
$ uname -p
# Output
# x86_64
```

My current system is `x86_64`. other values may be `i686`, `armv7l`, `aarch64`, `aarch64`. This is the Kernel name of the system.

### Current OS Release installed

```bash
$ lsb_release -a
```

The above command will provide information about the current OS installed on the system

```bash
No LSB modules are available.
Distributor ID: Ubuntu
Description:  Ubuntu 24.04.1 LTS
Release:  24.04
Codename: noble
```

### Get File system information

```bash
$ df -h
```

The above command will provide information about the file system mounted on the system in human-readable format for the size of the file system.

```bash
Filesystem      Size  Used Avail Use% Mounted on
udev            7.8G     0  7.8G   0% /dev
tmpfs           1.6G  1.9M  1.6G   1% /run
/dev/sda1       458G   11G  424G   3% /
tmpfs           7.8G   18M  7.8G   1% /dev/shm
tmpfs           5.0M  4.0K  5.0M   1% /run/lock
```
