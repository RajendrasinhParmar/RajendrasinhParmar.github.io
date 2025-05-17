---
title: Setup SonarQube on Ubuntu EC2
description: SonarQube setup on ubuntu EC2 with all required details
pubDatetime: 2025-03-18T09:59:09+05:30
postSlug: setup-sonarqube-on-ubuntu
featured: false
draft: false
tags:
  - AWS
  - EC2
  - Ubuntu
  - DevOps
  - SonarQube
---

![SonarQube Community Edition](@assets/images/logo-sonarqube-community.png)

## Table of contents

## TL;DR

- Install Java 17 or 21 (required for SonarQube)
- Install PostgreSQL and configure it for SonarQube
- Download and setup SonarQube
- Configure SonarQube to use PostgreSQL
- Start SonarQube service
- Configure Nginx as reverse proxy (optional)
- Access SonarQube web interface

## Introduction

SonarQube Community Build is an industry-standard on-premises automated code review and static analysis tool designed to detect coding issues in 20+ languages, frameworks, and IaC platforms. It helps developers write cleaner and safer code by detecting bugs, vulnerabilities, and code smells. In this guide, we'll set up SonarQube on an Ubuntu EC2 instance with PostgreSQL as the database. We are using SonarQube Community Build 25.5.0.107428 as of writing this blog.

> **Info:** We can also use Docker to setup SonarQube. But here we will use the traditional way to setup SonarQube on Ubuntu EC2 instance.

## Prerequisites

- Ubuntu EC2 instance (t2.medium or larger recommended)
- Basic knowledge of Linux commands
- Sudo privileges
- At least 4GB of RAM (SonarQube requires a minimum of 2GB RAM)

## Installation Steps

### 1. Install Java 17

SonarQube requires Java 17 to run. You can install it using either of the following methods:

#### Method 1: Using apt (Default)

```bash
# Update package list
sudo apt update

# Install Java 17
sudo apt install openjdk-17-jdk

# Verify installation
java -version
```

#### Method 2: Using SDKMAN (Recommended for managing multiple Java versions)

SDKMAN is a tool for managing multiple versions of various SDKs including Java. It's particularly useful if you need to switch between different Java versions.

```bash
# Install SDKMAN
curl -s "https://get.sdkman.io" | bash

# Source SDKMAN
source "$HOME/.sdkman/bin/sdkman-init.sh"

# Install Java 17
sdk install java 17.0.9-tem

# Verify installation
java -version
```

Benefits of using SDKMAN:

- Easy installation and management of multiple Java versions
- Simple switching between different Java versions
- Automatic environment variable management
- Support for multiple JDK vendors (Temurin, Amazon Corretto, etc.)

### 2. Install and Configure PostgreSQL

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create a new user and database for SonarQube
sudo -u postgres psql

# In PostgreSQL prompt, run:
CREATE USER sonarqube WITH PASSWORD 'your_password';
CREATE DATABASE sonarqube;
GRANT ALL PRIVILEGES ON DATABASE sonarqube TO sonarqube;
\q
```

### 3. Install SonarQube

```bash
# Create a directory for SonarQube
sudo mkdir /opt/sonarqube

# Download SonarQube
sudo wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-25.5.0.107428.zip

# Install unzip if not present
sudo apt install unzip

# Extract SonarQube
sudo unzip sonarqube-25.5.0.107428.zip -d /opt/sonarqube

# Set proper permissions
sudo chown -R $USER:$USER /opt/sonarqube
```

### 4. Configure SonarQube

Edit the SonarQube configuration file:

```bash
sudo nano /opt/sonarqube/sonarqube-25.5.0.107428/conf/sonar.properties
```

Add or modify these lines:

```properties
# Database configuration (required)
sonar.jdbc.username=sonarqube
sonar.jdbc.password=your_password
sonar.jdbc.url=jdbc:postgresql://localhost:5432/sonarqube

# Web server configuration (optional)
sonar.web.host=0.0.0.0
sonar.web.port=9000

# Search configuration (optional)
sonar.search.javaOpts=-Xmx512m -Xms512m -XX:MaxDirectMemorySize=256m -XX:+HeapDumpOnOutOfMemoryError

# Compute engine configuration (optional)
sonar.ce.javaOpts=-Xmx512m -Xms512m -XX:MaxDirectMemorySize=256m -XX:+HeapDumpOnOutOfMemoryError
```

### 5. Configuring the maximum number of open files and other limits

You must ensure that:

- The maximum number of memory map areas a process may have (vm.max_map_count) is greater than or equal to 524288.
- The maximum number of open file descriptors (fs.file-max) is greater than or equal to 131072.
- The user running SonarQube Community Build can open at least 131072 file descriptors.
- The user running SonarQube Community Build can open at least 8192 threads.

#### For a non-systemd user

1. Verify the values listed above with the following commands:

```bash
sysctl vm.max_map_count

sysctl fs.file-max

ulimit -n

ulimit -u
```

2. To change the max map count and the file-max, insert the following in /etc/sysctl.d/99-sonarqube.conf (or in /etc/sysctl.conf if you use the default file (not recommended)). To apply the changes, run the corresponding Linux command.

```
 vm.max_map_count=524288
 fs.file-max=131072
```

3. To change the limits on the user running SonarQube Community Build, insert the following in /etc/security/limits.d/99-sonarqube.conf (or in /etc/security/limits.conf if you use the default file (not recommended)) where SonarQube Community Build is the user used to run SonarQube Community Build. To apply the changes, run the corresponding Linux command.

```bash
sonarqube   -   nofile   131072

sonarqube   -   nproc    8192
```

#### For a systemd user

Specify those limits inside your unit file in the section [Service] :

```
[Service]

...

LimitNOFILE=131072

LimitNPROC=8192

...
```

### 6. Start SonarQube

```bash
# Start SonarQube
cd /opt/sonarqube/sonarqube-25.5.0.107428/bin/linux-x86-64
./sonar.sh start
```

### 7. Configure Nginx as Reverse Proxy (Optional)

```bash
# Install Nginx
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/sonarqube
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/sonarqube /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Accessing SonarQube

- If using Nginx: Visit `http://your_domain.com`
- If not using Nginx: Visit `http://your_ec2_ip:9000`

Default credentials: (Change it immediately after first login)

- Username: admin
- Password: admin

## Security Considerations

1. Change the default admin password immediately after first login
2. Configure SSL/TLS for production use
3. Set up proper firewall rules
4. Regularly update SonarQube and its dependencies
5. Configure proper memory settings based on your server capacity
6. Use strong passwords for database and admin accounts
7. Enable authentication for all users

## Troubleshooting

### Common Issues

1. **SonarQube fails to start**

   - Check Java version compatibility
   - Verify database connection
   - Check logs in `/opt/sonarqube/sonarqube-25.5.0.107428/logs/`

2. **Database Connection Issues**

   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database user has proper permissions

3. **Memory Issues**
   - Adjust Java heap size in `sonar.properties`
   - Monitor system resources
   - Consider upgrading instance if consistently running out of memory

## Conclusion

You now have a working SonarQube instance running on your Ubuntu EC2 instance. You can start analyzing your code quality by configuring your CI/CD pipelines to use SonarQube for code analysis.

## References

- [SonarQube Community Build Documentation](https://docs.sonarsource.com/sonarqube-community-build/)
- [SonarQube Community Build Requirements](https://docs.sonarsource.com/sonarqube-community-build/setup-and-upgrade/installation-requirements/server-host/)
- [SonarQube Database Requirements](https://docs.sonarsource.com/sonarqube-community-build/setup-and-upgrade/installation-requirements/database-requirements/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [SDKMAN Documentation](https://sdkman.io/usage)
