---
title: Optimize Memory Management with Dynamic Swap in ubuntu
description: Optimize Memory Management with Dynamic Swap in ubuntu
pubDatetime: 2024-04-14T01:14:47+05:30
postSlug: dynamic-swap-memory-setup-in-ubuntu
featured: false
draft: false
tags:
  - Ubuntu
---

![tp.web.random_picture](https://images.unsplash.com/photo-1473503993293-84743f5fda84?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8dHJlZSxsYW5kc2NhcGUsd2F0ZXJ8fHx8fHwxNzEzMDM3NDg4&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900)

Dynamic Swap Memory Setup in Ubuntu

## Table of contents

## TL;DR

- Start super user session in the terminal

```bash
# Start super user session in the terminal
$ sudo bash
# Create an empty file
$ mkdir /media/dynamicswap/swapfile.img
# Copy a file, converting and formatting it
$ dd if=/dev/zero of=/media/dynamicswap/swapfile.img bs=1024 count=32M
# Change file permissions
$ chmod 600 /media/fasthdd/swapfile.img
# Set up a Linux swap area
$ mkswap /media/dynamicswap/swapfile.img
```

- Update the file system configuration. Add a following entry at the end in `/etc/fstab`

```bash
/media/dynamicswap/swapfile.img swap swap sw 0 0
```

- Activate the swap partition

```bash
$ swapon /media/dynamicswap/swapfile.img
```

## Introduction

While working with Ubuntu or any other system we come across Swap. It is a portion of a computer's hard drive (or SSD) that is used as virtual memory when the physical RAM (Random Access Memory) is fully utilized. When a computer runs out of available RAM, it moves some data from RAM to the swap space on the disk to free up memory for other processes.

**Dynamic Swap**: In traditional setups, administrators manually allocate a fixed amount of swap space during system installation or configuration, but dynamic swap allows for automatic resizing of the swap space as required.

## Create Dynamic Swap

To create a dynamic swap we first need to create a file in our file system. For the whole setup of dynamic Swap, we will use the following file path `/media/dynamicswap/swapfile.img`. We can choose any file path we want as long as we have enough space available for the swap size we want to create.

**Note**: We will need a super user session in the terminal for the setup

```bash
$ sudo bash
```

### Create an empty file and format it

We will create a file for 32GB swap size. The following command will create an empty file and format it according to the provided parameters.

```bash
$ mkdir /media/dynamicswap/swapfile.img
$ dd if=/dev/zero of=/media/dynamicswap/swapfile.img bs=1024 count=32M
```

`bs`: Configuration for reading and writing bytes at a time.

`count`: Total blocks to copy.

According to this total memory for swap will be `1024 * 32M = 32G`

### Update the permission for the created file

To properly use the swap file system will need proper permission setup. so we will make the permission of file `600`. so only the owner of the file will have permission to read and write the file. In this case `root` will be the owner of the file

```bash
$ chmod 600 /media/dynamicswap/swapfile.img
```

### Make swap filesystem in swap file

Now we will create a swap filesystem in our newly created swap file.

```bash
$ mkswap /media/dynamicswap/swapfile.img
```

### Edit filesystem configuration

Once the swap filesystem is created in the swap file, we need to add the reference of the new swap in the filesystem configuration. The file system configuration is in `/etc/fstab`. open the file and add the following line at the end of the file

```
/media/dynamicswap/swapfile.img swap swap sw 0 0
```

### Activate swap

To activate the dynamic swap there are two ways. either we can reboot the system to activate the newly created swap configuration or use the following command.

```bash
$ swapon /media/dynamicswap/swapfile.img
```

## Conclusion

Dynamic swap memory in Ubuntu offers a flexible solution for adapting to varying workloads and resource demands. we can efficiently set up and activate dynamic swap, enhancing system performance. We can experiment with configurations to tailor memory management to your specific needs for optimal efficiency.
