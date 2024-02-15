---
title: Python version management with pyenv
description: Manage Multiple Python versions using pyenv and virtual environments
pubDatetime: 2024-01-14T00:19:50+05:30
postSlug: python-version-management-with-pyenv
featured: false
draft: false
tags:
  - python
  - pyenv
---

![tp.web.random_picture](https://images.unsplash.com/photo-1534142499731-a32a99935397?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8dHJlZSxsYW5kc2NhcGUsd2F0ZXIsbW91bnRhaW58fHx8fHwxNzA1MTcxNzkx&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900)

#### Manage Multiple Python versions using pyenv and virtual environments

## Table of contents

## TL;DR

- Installation of dependencies for pyenv

```sh
$ sudo apt-get install -y make build-essential libssl-dev zlib1g-dev \
libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev \
libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev
```

- install `python3-openssl`

```sh
$ sudo apt-get install python3-openssl
```

- Install pyenv

```sh
$ curl https://pyenv.run | bash
```

- list and install python

```sh
$ pyenv install --list # list the python versions
$ pyenv install -v 3.8.0 # install python version
```

## Introduction

While working on different Python projects we might need to work with different versions of Python. along with that we also might need to experiment with new features in the latest released versions.

To easily manage different versions of Python we need a Python version manager. `pyenv` is a version manager for Python.

## Issue with the system python?

If you are on a Mac or a Linux system, they already have Python installed on the operating system. It is known as "System Python". System Python is installed in the root directory. you can find out the current version using:

```sh
$ which python3
# /usr/bin/python3
```

When we install a package into the system python, it is installed as a global package and we need to use the `sudo pip3 install` command. As all the packages are installed globally with this approach, we tend to get an issue when we want to install multiple versions of a library.
Along with that, we do not have any control over the Python version that comes bundled with the system.

Even if we install Python directly on the system, it will install it in the user space. We will not need `sudo` for the installation of the package. However, the issue with multiple versions of the same package will still be there.

Switching Python versions is also an issue if we want to install multiple versions of Python.

## Use package(version) manager

To overcome the issues with system/global python we can use package manager. The package manager will allow us to manage the following issues.

- Install Python in your user space
- Install multiple versions of Python
- Specify the exact Python version
- Switch between the installed versions

**pyenv** is one of the Python version managers. We will go through the details of how to install and manage `pyenv`

## Installation

Before we install `pyenv` itself we need to install system-specific dependencies. most of these dependencies are written in C and they are required to install Python from source.

### Build Dependencies

`pyenv` builds Python from the source, which means we need to install utility dependencies to use `pyenv`.

#### Ubuntu

```sh
$ sudo apt-get install -y make build-essential libssl-dev zlib1g-dev \
libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev \
libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev
```

We also need to install `python3-openssl` on Ubuntu

```sh
$ sudo apt-get install python3-openssl
```

#### Fedora/CentOS/RHEL

```sh
$ sudo yum install gcc zlib-devel bzip2 bzip2-devel readline-devel \ sqlite sqlite-devel openssl-devel xz xz-devel libffi-devel
```

#### MacOS

```sh
$ brew install openssl readline sqlite3 xz zlib
```

When running Mojave or higher you will also need to install the additional SDK headers:

```sh
$ sudo installer -pkg /Library/Developer/CommandLineTools/Packages/macOS_SDK_headers_for_macOS_10.14.pkg -target /
```

### Installation using pyenv-installer

After successfully installing build dependencies we will install `pyenv` using the installation script.

```sh
$ curl https://pyenv.run | bash
```

This command will install `pyenv` along with a few plugins.

- **pyenv** - the main application
- **pyenv-virtualenv** - Plugin for pyenv and virtual environment
- **pyenv-update** - Plugin for updating pyenv
- **pyenv-doctor** - Plugin to verify that pyenv and build dependencies are installed
- **pyenv-which-ext** - Plugin to automatically lookup system commands

Once this is done we need to update the bash profile. add the following lines at the end of the bash profile. the file name will be dependent on the shell that you are using. common file names based on files are `bashrc`, `zshrc`, `bash_profile`

```sh
# ~/.bashrc
Load pyenv automatically by adding
the following to ~/.bashrc:

export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

Once done we need to either restart the terminal or source the shell file.

```sh
$ source ~/.bashrc
# or
$ exec "$SHELL"
```

## Useful pyenv commands

### List Python versions

```sh
$ pyenv install --list
```

### Install python

```sh
$ pyenv install -v 3.10.0
```

### Currently installed Python versions

```sh
$ pyenv versions
```

### Set global python version

```sh
$ pyenv global 3.10.0
```

### Set local python version for project development

```sh
$ pyenv local 3.10.0
```

### Uninstall python

```sh
$ pyenv uninstall 3.10.0
```

### pyenv Commands

```sh
$ pyenv commands
```
