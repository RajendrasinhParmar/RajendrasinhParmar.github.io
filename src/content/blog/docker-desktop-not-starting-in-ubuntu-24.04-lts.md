---
title: Docker desktop not starting in Ubuntu 24.04 LTS
description: Docker desktop not starting on Ubuntu 24.04
pubDatetime: 2024-11-01T22:49:52+05:30
postSlug: docker-desktop-not-starting-in-ubuntu-24.04-lts
featured: false
draft: false
tags:
  - docker
  - linux
  - Ubuntu
---

![tp.web.random_picture](https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&cs=tinysrgb&fm=jpg&h=390&ixid=MnwxfDB8MXxyYW5kb218MHx8dHJlZSxsYW5kc2NhcGUsd2F0ZXJ8fHx8fHwxNzA4NTcwNDMx&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900)

Docker desktop not starting on Ubuntu 24.04

## Table of contents

## TL;DR

In Ubuntu 24.04 LTS the Apparmor is enabled by default and it is blocking the docker desktop from starting. AppArmor is a security module that can control the granular access to applications.

AppArmor policy is used to selectively control access to unprivileged user namespaces on a per applications basis.

### Create a new profile for Docker Desktop

Create a new profile named `opt.docker-desktop.bin.com.docker.backend` in the `/etc/apparmor.d/` directory and add the following content to the file.

```bash
abi <abi/4.0>,

include <tunables/global>

/opt/docker-desktop/bin/com.docker.backend flags=(default_allow) {
  userns,

  # Site-specific additions and overrides. See local/README for details.
  include if exists <local/opt.docker-desktop.bin.com.docker.backend>
}
```

### Reload the apparmor profile

After creating the profile reload the apparmor profile using the following command.

```bash
sudo apparmor_parser -r /etc/apparmor.d/opt.docker-desktop.bin.com.docker.backend
```

Or you can reload all the apparmor services using the following command.

```bash
$ sudo systemctl restart apparmor.service
```

### Start the Docker Desktop

After reloading the apparmor profile you can start the Docker Desktop.

## Introduction

I have recently migrated to Ubuntu 24.04 LTS from the older Ubuntu 20.04 LTS. After the migration, I installed Docker Desktop and tried to start it but it was not starting and silently failing. After some investigation, I found that the apparmor is blocking the Docker Desktop from starting.

## What is AppArmor

AppArmor is an easy-to-use Linux Security Module implementation that restricts applications’ capabilities and permissions with profiles that are set per program. It provides mandatory access control (MAC) to supplement the more traditional UNIX model of discretionary access control (DAC).

### How to check if AppArmor is enabled

In Ubuntu, AppArmor is installed and loaded by default – you can check this by running aa-status

```bash
$ sudo aa-status
```

### AppArmor Profiles

AppArmor uses profiles of an application to determine what files and permissions the application requires. Some packages will install their profiles, and additional profiles can be found in the `apparmor-profiles` package.

#### Install AppArmor Profiles

To install the AppArmor profiles package, run the following command:

```bash
$ sudo apt install apparmor-profiles
```

AppArmor profiles have two modes of operation:

- **Complaining/Learning**: profile violations are permitted and logged. This is useful for testing and developing new profiles.
- **Enforced/Confined**: enforces profile policy in addition to logging the violation.

#### Profile

AppArmor profiles are simple text files located in `/etc/apparmor.d/`. The files are named after the full path to the executable they profile, replacing `/` with `.`. For example, the profile for `/bin/ping` would be `/etc/apparmor.d/bin.ping`.

There are two main types of rules in AppArmor profiles:

- **Path entries**: detailing which files an application can access in the filesystem.
- **Capability entries**: determine what privileges a confined process is allowed to use.

An example profile for the `ping` command is shown below:

```bash
#include <tunables/global>
/bin/ping flags=(complain) {
  #include <abstractions/base>
  #include <abstractions/consoles>
  #include <abstractions/nameservice>

  capability net_raw,
  capability setuid,
  network inet raw,

  /bin/ping mixr,
  /etc/modules.conf r,
}
```

The above can be broken down as follows:

- `#include <tunables/global>`: Include statements from other files. This allows statements pertaining to multiple applications to be placed in a common file.
- `/bin/ping flags=(complain)`: The path to the executable being profiled, with the `complain` flag.
- `capability net_raw,`: Allows the application access to the `CAP_NET_RAW` `Posix.1e` capability.
- `/bin/ping mixr,`: Allows the application to read and execute access to the `/bin/ping` file.

## Docker Desktop AppArmor Profile

AppArmor uses a profile to control the access of the application. The profile is located at `/etc/apparmor.d/opt.docker-desktop.bin.com.docker.backend`. If the above profile is not present then you can create a new profile with the following content.

Create a new profile named `opt.docker-desktop.bin.com.docker.backend` in the `/etc/apparmor.d/` directory and add the following content to the file.

```bash
abi <abi/4.0>,

include <tunables/global>

/opt/docker-desktop/bin/com.docker.backend flags=(default_allow) {
  userns,

  # Site-specific additions and overrides. See local/README for details.
  include if exists <local/opt.docker-desktop.bin.com.docker.backend>
}
```

### Reload the apparmor profile

After creating the profile reload the apparmor profile using the following command.

```bash
$ sudo apparmor_parser -r /etc/apparmor.d/opt.docker-desktop.bin.com.docker.backend
# OR reload all the apparmor services
$ sudo systemctl restart apparmor.service
```

### Start the Docker Desktop

After reloading the apparmor profile you can start the Docker Desktop.

## Conclusion

In Ubuntu 24.04 LTS the apparmor is enabled by default and it is blocking the docker desktop from starting. Apparmor is a security module and can be used to granularly control the access of the applications. AppArmor policy is used to selectively control access to unprivileged user namespaces on a per applications basis.

The above example is for the docker-desktop application. However, you can create a profile for any application that is being blocked by the apparmor.

## References

- [AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)
- [Restricted unprivileged user namespaces are coming to Ubuntu 23.10](https://ubuntu.com/blog/ubuntu-23-10-restricted-unprivileged-user-namespaces)
