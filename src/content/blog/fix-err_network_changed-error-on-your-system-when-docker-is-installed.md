---
title: Fix ERR_NETWORK_CHANGED error on your system when docker is installed
description: Fix the ERR_NETWORK_CHANGED error while docker is installed and you are getting the above error again and again
pubDatetime: 2025-06-01T10:25:36+05:30
postSlug: fix-err_network_changed-error-on-your-system-when-docker-is-installed
featured: false
draft: false
tags:
  - docker
  - linux
---

![tp.web.random_picture](https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&cs=tinysrgb&fm=jpg&h=390&ixid=MnwxfDB8MXxyYW5kb218MHx8dHJlZSxsYW5kc2NhcGUsd2F0ZXJ8fHx8fHwxNzA4NTcwNDMx&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900)

Fix the ERR_NETWORK_CHANGED error while docker is installed and you are getting the above error again and again.

## Table of contents

## TL;DR

If you're getting ERR_NETWORK_CHANGED errors with Docker installed and running:

1. Edit Docker daemon configuration:

```bash
$ sudo nano /etc/docker/daemon.json
```

2. Add the following configuration to the file. If the file already exists, add the DNS to the existing file. If the file does not exist, create it and add the DNS to the file.

```json
{
  "dns": ["8.8.8.8", "8.8.4.4"]
}
```

> Note: If there is an extra IP address entry for DNS apart from the ones mentioned above, remove it.

3. Save the file and restart Docker:

```bash
$ sudo systemctl restart docker
```

4. Restart the browser and check if the issue is fixed.

## Introduction

I am using Docker Community Edition to manage my local Docker containers, primarily for development purposes. I have been using it for a long time and I have never faced this issue. However, For the last few weeks, I have been facing this issue. I have tried different solutions and found one that works for me.

## The Problem

If you're experiencing the ERR_NETWORK_CHANGED error while Docker is running, you're not alone. This is a common issue that occurs because Docker modifies your system's network configuration when it starts up. The error typically appears in web browsers and can be quite frustrating, especially when you need both Docker and stable internet connectivity for development.

## The Solutions I have tried

To identify and pinpoint the issue I tried a very simple solution as a starting point and stopped the docker.

### 1. Stop Docker

```bash
$ sudo systemctl stop docker.service
$ sudo systemctl stop docker.socket # This keeps the docker service running in the background and restarts it when needed. So we need to stop both of them.
```

After stopping the docker service and socket everything started working.

As the issue was pinpointed, I tried searching for related solutions and found a configuration that could fix it.

### 2. Configure Docker DNS Settings

The most reliable solution is to configure Docker's DNS settings. Here's how to do it:

1. Check if the Docker daemon configuration file exists and also check its content:

```bash
$ ls -l /etc/docker/daemon.json
# output:
# -rw-r--r-- 1 root root 123 Jun  1 10:25 /etc/docker/daemon.json
$ cat /etc/docker/daemon.json
# output:
# {
#     "dns": ["1.1.1.1", "8.8.8.8", "8.8.4.4"]
# }
```

The DNS entry in the above file does have a DNS with `1.1.1.1` which is not actual DNS, it is a host DNS that docker uses internally. Due to this it always tries to resolve the names with `1.1.1.1` and it fails. So to fix that we will edit the `daemon.json` file and add the actual DNS to the file.

2. Create or edit the Docker daemon configuration file if it does not exist or if its content is not as expected:

```bash
$ sudo nano /etc/docker/daemon.json
```

3. Add the following configuration to the file:

```json
{
  "dns": ["8.8.8.8", "8.8.4.4"]
}
```

4. Save the file and restart Docker to apply the changes:

```bash
$ sudo systemctl restart docker
# if the docker is stopped, we need to start it again
$ sudo systemctl start docker.service
$ sudo systemctl start docker.socket
```

5. Check the DNS settings again:

```bash
$ cat /etc/docker/daemon.json
# output:
# {
#     "dns": ["8.8.8.8", "8.8.4.4"]
# }
```

6. Restart the browser and check if the issue is fixed.

## Conclusion

The ERR_NETWORK_CHANGED error is a common side effect of Docker's network configuration. By implementing the above solution, you should be able to maintain both Docker functionality and stable internet connectivity. The DNS configuration method is usually the most effective and least intrusive solution.

Remember to restart your browser after implementing any of these changes to ensure they take effect properly if it does not work directly after configuration update.
