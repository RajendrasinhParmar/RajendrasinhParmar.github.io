---
title: Docker fails to connect to internet from inside the container
description: Docker can't install npm packages or pip package or any other content  from the internet
pubDatetime: 2024-02-22T08:23:50+05:30
postSlug: docker-fails-to-connect-to-npm-registry-or-pip
featured: false
draft: false
tags:
  - Docker
---

![tp.web.random_picture](https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&cs=tinysrgb&fm=jpg&h=390&ixid=MnwxfDB8MXxyYW5kb218MHx8dHJlZSxsYW5kc2NhcGUsd2F0ZXJ8fHx8fHwxNzA4NTcwNDMx&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900)

Docker can't install npm packages or pip packages from the internet

## Table of contents

## TL;DR

One of the main reasons for this issue is DNS name resolution failing. So to fix this issue we can add a public DNS server name in the network configuration. To add the DNS configuration for the docker, add the following configuration to the `/etc/docker/daemon.json` file. If the file does not exist, please create one.

```json
{
  "dns": ["10.0.0.2", "8.8.8.8", "8.8.4.4"]
}
```

- Once done restart the docker service

```bash
$ sudo service docker restart
```

## Introduction

Sometimes times docker's internet connectivity does not work as expected and causes so many weird issues with the applications running inside the docker container. Most of the time these issues are caused due to [DNS](https://en.wikipedia.org/wiki/Domain_Name_System) lookup failing inside the docker image.

## What is DNS lookup?

DNS lookup is the process of converting human-readable domain names (e.g., [www.rajendrasinh.com](https://www.rajendrasinh.com/)) into IP addresses. It involves querying hierarchical DNS servers to obtain the IP associated with a domain. This translation allows users to access websites using easily remembered names rather than numerical IP addresses.

## DNS configuration

Whenever we connect to the internet our system has the configuration setup where we add a DNS server IP address. In Ubuntu, it's typically in the network configuration. you can go to `Settings > wifi or Network > gear icon for currently active connection`. This will look something like this

![Ubuntu DNS configuration](@assets/images/dns-configuration-ubuntu.png)

## DNS issue with docker

When Docker is running in the system it also uses the internet from the host system to communicate to the internet. As docker has its configuration for the network communication, first it will go and try to resolve the DNS using the configuration provided in the `/etc/docker/daemon.json` file. by default, this file is not available when we install the docker. instead, it uses the host system's DNS. If the host system DNS configuration is not correct, it might fail to resolve the IP address for the requests sent from the docker container. To resolve this we have mainly two options

### DNS update in the host system (in our case Ubuntu)

Go to `Settings > wifi or Network > gear icon for currently active connection` and check if the setting under the `IPv4` tab is set to automatic for DNS.

If the DNS is set to Automatic, switch that off and add comma comma-separated value of Google public DNS `8.8.8.8, 8.8.4.4` (as provided in the image above). Once this is done, the issue with lookup should be resolved.

### Docker daemon.json configuration file

If the `daemon.json` file is available for the docker configuration, we can update the configuration with the following content

```json
{
  "dns": ["10.0.0.2", "8.8.8.8", "8.8.4.4"]
}
```

## Conclusion

In troubleshooting Docker connectivity issues, DNS lookup failures often play a crucial role. To address this, adding public DNS server names, such as Google's (8.8.8.8 and 8.8.4.4), to the Docker configuration (`/etc/docker/daemon.json`) or updating the host system's DNS settings can resolve these issues, ensuring smooth communication for applications within Docker containers.
