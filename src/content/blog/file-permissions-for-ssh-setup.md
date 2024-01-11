---
title: File Permissions for ssh setup
description: Correct configuration of files and folder permission for correct ssh setup on system
pubDatetime: 2023-12-31T11:59:22+05:30
postSlug: file-permissions-for-ssh-setup
featured: false
draft: false
tags:
  - ssh
  - filepermissions
---

![tp.web.random_picture](https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900&h=350)

# Permissions on SSH Files and Folders

## Table of contents

## TL;DR

Correct Permissions for the ssh directory are as follows.

- `~/.ssh` directory **700** (drwx------)
- `~/.ssh/config` file **600** (-rw-------)
- `~/.ssh/<PUBLIC_KEY_FILE>.pub` files **644** (-rw-r--r--)
- `~/.ssh/<PRIVATE_KEY_FILE>` files **600** (-rw-------)

## Introduction

When we want to connect to a remote server or clone our repository from the repository providers like GitHub, GitLab, or Bitbucket, we also need to implement correct file permission.

While using the SSH, we also need to check for correct the permissions on public and private files.

When we generate the public-private key pair on the host machine, and use them, we might not face any issues with file permissions. However, if we are restoring key files from backup, we might end up with broken permissions for those files. We might face the following error,

```bash
$ ssh <hostname>
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@ WARNING: UNPROTECTED PRIVATE KEY FILE! @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
$ ssh <hostname>
"Bad owner or permissions on ~/.ssh/config"
```

## Resolution

To resolve the issue, following are the permissions that we need to set correctly. There are the following files/folders involved in the SSH process

1. ~/.ssh (folder)
2. ~/.ssh/config (file)
3. ~/.ssh/\*.pub (public key files)
4. ~/.ssh/\* (private key files)

### ssh folder

Permission for the ssh directory must be limited to current users only. so the permission should be **700** (drwx------) for the ssh directory. In-case, the permission is not 700 for SSH, we can use the following command to update that.

```sh
$ chmod 700 ~/.ssh
```

### ssh config file

The config file holds the configuration of the SSH setup for all the SSH keys present in the system. Correct permission for the config file is **600** (-rw-------). In case they are not as above, use the following command to update it to correct values.

```sh
$ chmod 600 ~/.ssh/config
```

### public key files

Public key files are public keys, that we usually share or add to the remote server to configure SSH. Correct permission for the public key files are **644** (-rw-r--r--)

```sh
$ chmod 644 ~/.ssh/<PUBLIC_KEY_FILE>.pub
```

### Private key files

Private keys are secret keys that we keep securely on the system. and to make sure they are not shared and anyone else does not have permission to access those files, we set the permission for those files to **600** (-rw-------).

```sh
$ chmod 600 ~/.ssh/<PRIVATE_KEY_FILE>
```
