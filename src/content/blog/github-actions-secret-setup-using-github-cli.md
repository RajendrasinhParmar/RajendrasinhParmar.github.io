---
title: Github Actions Secret Setup Using Github CLI
description: Setup Github Actions Secrets Using Github Cli To Speed Up Creation of Secrets When There Are A Lot Of Environment Variables
pubDatetime: 2025-09-30T12:36:26+05:30
postSlug: github-actions-secret-setup-using-github-cli
featured: false
draft: false
tags:
  - github
  - cli
  - DevOps
  - secrets
---

![Rubaitul Azad(https://unsplash.com/@rubaitulazad?utm_source=templater_proxy&utm_medium=referral) on Unsplash](https://images.unsplash.com/photo-1654277041218-84424c78f0ae?q=80&w=1462&auto=format&fit=crop&ixlib=rb-4.1.0&w=900&h=350)

## Table of contents

## TL;DR

Setting up GitHub Actions secrets manually through the web interface can be time-consuming when you have many environment variables. GitHub CLI offers a powerful solution to automate this process:

```bash
# Set a single secret
gh secret set SECRET_NAME

# Set secrets from environment file (FASTEST METHOD)
gh secret set --env-file .env.production --app actions --env production --repo your-org/your-repo

# Set a secret from a file
gh secret set SECRET_NAME < secret.txt

# Set environment-specific secrets
gh secret set SECRET_NAME --env production

# Set organization-level secrets
gh secret set SECRET_NAME --org my-org

# List all secrets
gh secret list
```

**Key Benefits:**

- **Bulk secret creation**: Set dozens of secrets with a single `--env-file` command
- **Environment-specific management**: Separate configurations for dev/staging/production
- **Organization-wide sharing**: Share secrets across multiple repositories
- **Command-line efficiency**: Skip the tedious web interface completely

## Introduction

Managing GitHub Actions secrets through the web interface becomes tedious when you have many environment variables. GitHub CLI offers a much faster command-line approach that can save hours of manual work.

This post covers everything from basic secret creation to bulk operations using GitHub CLI.

## Prerequisites

Before diving into secret management, ensure you have the following setup:

### 1. Install GitHub CLI

If you haven't installed GitHub CLI yet, you can download it from the [official GitHub CLI manual](https://cli.github.com/manual/) or install it using your package manager:

```bash
# On macOS using Homebrew
brew install gh

# On Ubuntu/Debian
sudo apt install gh

# On Windows using Chocolatey
choco install gh

# On Windows using Scoop
scoop install gh
```

### 2. Authenticate with GitHub

Authenticate the CLI with your GitHub account:

```bash
gh auth login
```

Follow the interactive prompts to:

- Choose GitHub.com or GitHub Enterprise Server
- Select your preferred authentication method (web browser or token) (I Personally prefer to configure SSH for the authentication)
- Complete the authentication process

### 3. Navigate to Your Repository

Make sure you're in your repository directory:

```bash
cd /path/to/your/repository
```

You can verify you're in the correct repository by running:

```bash
gh repo view
```

**Note:** We assume that the github remote is already set up and we are in the correct repository.

## Basic Secret Management

### Creating a Single Secret

The most basic operation is creating a single secret. Use the `gh secret set` command:

```bash
gh secret set API_KEY
```

After running this command, GitHub CLI will prompt you to enter the secret value securely. The input will be hidden for security purposes. Secret values are locally encrypted before being sent to GitHub.

**Example workflow:**

```bash
$ gh secret set DATABASE_URL
? Enter secret value: ***************************
✓ Set secret DATABASE_URL for your-username/your-repo
```

### Setting a Secret from a File

If you have secret values stored in files (common for certificates or long tokens), you can set them directly:

```bash
gh secret set SSL_CERTIFICATE < certificate.pem
gh secret set PRIVATE_KEY < private_key.txt
```

This approach is particularly useful for:

- SSL certificates
- SSH private keys
- Large configuration files
- JSON service account keys

### Setting Secrets with Inline Values

For automation scripts, you can set secrets with inline values:

```bash
echo "your-secret-value" | gh secret set SECRET_NAME
```

**Security Note:** Be cautious with this method as the secret value might be visible in your shell history. Consider using it only in secure environments or automation scripts.

## Advanced Secret Management

### Listing Existing Secrets

Before adding new secrets, you might want to see what's already configured:

```bash
# List all repository secrets
gh secret list

# List secrets with more details
gh secret list --json name,visibility,updatedAt
```

### Environment-Specific Secrets

GitHub Actions supports environment-specific secrets, which are perfect for managing different configurations across development, staging, and production environments.

#### Creating Environment Secrets

First, ensure your environment exists in your repository (create it via GitHub web interface under Settings > Environments if needed):

```bash
# Set a secret for a specific environment
gh secret set DATABASE_URL --env production
gh secret set DATABASE_URL --env staging
gh secret set DATABASE_URL --env development
```

#### Listing Environment Secrets

```bash
# List secrets for a specific environment
gh secret list --env production
gh secret list --env staging
```

### Organization-Level Secrets

For secrets that need to be shared across multiple repositories in your organization:

```bash
# Set an organization secret
gh secret set SHARED_API_KEY --org your-organization

# Set organization secret with specific repository access
gh secret set SHARED_TOKEN --org your-organization --repos "repo1,repo2,repo3"

# Set organization secret with visibility for all repositories
gh secret set PUBLIC_CONFIG --org your-organization --visibility all
```

#### Managing Organization Secret Visibility

```bash
# Make secret available to all repositories
gh secret set SECRET_NAME --org your-org --visibility all

# Make secret available to private repositories only (default)
gh secret set SECRET_NAME --org your-org --visibility private

# Make secret available to selected repositories
gh secret set SECRET_NAME --org your-org --visibility selected --repos "repo1,repo2"
```

### Updating and Deleting Secrets

#### Updating Secrets

To update an existing secret, simply use the same `set` command:

```bash
gh secret set API_KEY
# Enter the new value when prompted
```

#### Deleting Secrets

```bash
# Delete a repository secret
gh secret delete SECRET_NAME

# Delete an environment secret
gh secret delete SECRET_NAME --env production

# Delete an organization secret
gh secret delete SECRET_NAME --org your-organization
```

## Bulk Secret Management

This is where GitHub CLI truly shines - when you have multiple environment variables to set up. Here are the most effective approaches for bulk operations:

### Method 1: Using Environment Files with --env-file Flag (Recommended)

The most efficient and error-free way to bulk set secrets is using the `--env-file` flag, which reads all environment variables from a file and sets them as secrets in one command.

Create environment files for different environments:

```bash
# .env.production (DO NOT COMMIT THIS FILE)
DATABASE_URL=postgresql://prod_user:Pr0d_P@ssw0rd123@prod-db.company.com:5432/myapp_production
API_KEY=prod_api_1234567890abcdef1234567890abcdef
JWT_SECRET=super_secure_prod_jwt_secret_key_2024_v1_xyz789
STRIPE_SECRET_KEY=not_a_secret_key_sk_live_51ABCDEFghijklmnopQRSTUVwxyz1234567890
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7PRODEXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYPRODEXAMPLEKEY
REDIS_URL=redis://prod_redis_user:RedisP@ss123@prod-redis.company.com:6379
SENDGRID_API_KEY=SG.1234567890abcdef.ghijklmnopqrstuvwxyz1234567890abcdef
SENTRY_DSN=https://1234567890abcdef1234567890abcdef@o123456.ingest.sentry.io/1234567
```

```bash
# .env.staging (DO NOT COMMIT THIS FILE)
DATABASE_URL=postgresql://staging_user:St@g_P@ssw0rd456@staging-db.company.com:5432/myapp_staging
API_KEY=staging_api_abcdef1234567890abcdef1234567890
JWT_SECRET=staging_jwt_secret_key_2024_test_version_abc123
STRIPE_SECRET_KEY=not_a_secret_key_sk_test_51ABCDEFghijklmnopQRSTUVwxyz0987654321
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7STAGINGEXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYSTAGINGEXAMPLE
REDIS_URL=redis://staging_redis_user:RedisTest456@staging-redis.company.com:6379
SENDGRID_API_KEY=SG.staging1234567890.testghijklmnopqrstuvwxyz1234567890
SENTRY_DSN=https://staging1234567890abcdef1234567890@o123456.ingest.sentry.io/7654321
```

Now set all secrets with a single command:

```bash
# Set all production secrets from file
gh secret set --env-file .env.production --app actions --env production --repo your-org/your-repo

# Set all staging secrets from file
gh secret set --env-file .env.staging --app actions --env staging --repo your-org/your-repo

# For current repository (no --repo needed)
gh secret set --env-file .env.production --app actions --env production
```

**Command breakdown:**

- `--env-file .env.production`: Read secrets from the specified file
- `--app actions`: Target GitHub Actions (can also be `codespaces` or `dependabot`)
- `--env production`: Set secrets for the production environment
- `--repo your-org/your-repo`: Target specific repository (optional if you're in the repo directory)

> **💡 Pro Tip:** The `--env-file` approach is the most reliable method as it eliminates manual typing errors, handles special characters automatically, and processes all secrets in a single atomic operation. This is the recommended approach for production environments.

### Method 2: Using a Shell Script (Interactive)

Create a script to set multiple secrets with interactive prompts:

```bash
#!/bin/bash
# setup-secrets-interactive.sh

# Array of secret names
secrets=(
    "DATABASE_URL"
    "API_KEY"
    "JWT_SECRET"
    "REDIS_URL"
    "SMTP_PASSWORD"
    "AWS_ACCESS_KEY_ID"
    "AWS_SECRET_ACCESS_KEY"
)

echo "Setting up secrets for the repository..."
echo "You will be prompted to enter each secret value securely."

for secret in "${secrets[@]}"; do
    echo "Setting $secret..."
    gh secret set "$secret"  # This will prompt for the value
done

echo "All secrets have been set!"
```

**Alternative: Pre-defined Values Script**

If you want to set secrets with predefined values (be careful with security):

```bash
#!/bin/bash
# setup-secrets-predefined.sh

echo "Setting up secrets for the repository..."

# Set secrets with predefined values (USE WITH CAUTION)
echo "prod-db-connection-string" | gh secret set DATABASE_URL
echo "your-api-key-here" | gh secret set API_KEY
echo "your-jwt-secret" | gh secret set JWT_SECRET
echo "redis://localhost:6379" | gh secret set REDIS_URL

echo "All secrets have been set!"
```

Run the scripts:

```bash
chmod +x setup-secrets-interactive.sh
./setup-secrets-interactive.sh

# Or for predefined values
chmod +x setup-secrets-predefined.sh
./setup-secrets-predefined.sh
```

### Method 3: Using Environment Variables

If you have your secrets in environment variables (common in development):

```bash
#!/bin/bash
# bulk-secrets-from-env.sh

# Set secrets from current environment variables
gh secret set DATABASE_URL <<< "$DATABASE_URL"
gh secret set API_KEY <<< "$API_KEY"
gh secret set JWT_SECRET <<< "$JWT_SECRET"
gh secret set REDIS_URL <<< "$REDIS_URL"
```

### Cross-Environment Setup

Set up the same secrets across multiple environments:

```bash
#!/bin/bash
# multi-env-setup.sh

environments=("development" "staging" "production")
secrets=("DATABASE_URL" "API_KEY" "JWT_SECRET")

for env in "${environments[@]}"; do
    echo "Setting up secrets for $env environment..."
    for secret in "${secrets[@]}"; do
        echo "Setting $secret for $env..."
        gh secret set "$secret" --env "$env"
    done
done
```

## Real-World Example: Complete Project Setup

Let's walk through a complete example using the `--env-file` approach for a typical backend application:

### Example 1: Using --env-file for Multiple Environments

First, create your environment files:

```bash
# .env.production
DATABASE_URL=postgresql://prod_user:Pr0d_P@ssw0rd123@prod-db.company.com:5432/myapp_production
API_KEY_STRIPE=sk_live_51ABCDEFghijklmnopQRSTUVwxyz1234567890
JWT_SECRET=super_secure_prod_jwt_secret_key_2024_v1_xyz789
REDIS_URL=redis://prod_redis_user:RedisP@ss123@prod-redis.company.com:6379
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7PRODEXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYPRODEXAMPLEKEY
SENDGRID_API_KEY=SG.1234567890abcdef.ghijklmnopqrstuvwxyz1234567890abcdef
SENTRY_DSN=https://1234567890abcdef1234567890abcdef@o123456.ingest.sentry.io/1234567
DOCKER_HUB_USERNAME=mycompany_prod
DOCKER_HUB_TOKEN=dckr_pat_1234567890abcdef1234567890abcdef
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T1234567890/B1234567890/1234567890abcdef1234567890abcdef
```

```bash
# .env.staging
DATABASE_URL=postgresql://staging_user:St@g_P@ssw0rd456@staging-db.company.com:5432/myapp_staging
API_KEY_STRIPE=sk_test_51ABCDEFghijklmnopQRSTUVwxyz0987654321
JWT_SECRET=staging_jwt_secret_key_2024_test_version_abc123
REDIS_URL=redis://staging_redis_user:RedisTest456@staging-redis.company.com:6379
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7STAGINGEXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYSTAGINGEXAMPLE
SENDGRID_API_KEY=SG.staging1234567890.testghijklmnopqrstuvwxyz1234567890
SENTRY_DSN=https://staging1234567890abcdef1234567890@o123456.ingest.sentry.io/7654321
DOCKER_HUB_USERNAME=mycompany_staging
DOCKER_HUB_TOKEN=dckr_pat_staging1234567890abcdef1234567890
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0987654321/B0987654321/staging1234567890abcdef1234567890
```

Now set all secrets with simple commands:

```bash
# Set all production secrets
gh secret set --env-file .env.production --app actions --env production --repo Neurality-AI/neurality_admin_backend

# Set all staging secrets
gh secret set --env-file .env.staging --app actions --env staging --repo Neurality-AI/neurality_admin_backend

# If you're in the repository directory, you can omit --repo
gh secret set --env-file .env.production --app actions --env production
gh secret set --env-file .env.staging --app actions --env staging
```

### Example 2: Traditional Script Approach

```bash
#!/bin/bash
# complete-project-setup.sh

echo "Setting up GitHub Actions secrets for MyApp"

# Database secrets
echo "Setting up database secrets..."
gh secret set DATABASE_URL --env production
gh secret set DATABASE_URL --env staging
gh secret set DB_PASSWORD --env production
gh secret set DB_PASSWORD --env staging

# API Keys
echo "Setting up API keys..."
gh secret set STRIPE_SECRET_KEY --env production
gh secret set STRIPE_PUBLISHABLE_KEY --env production
gh secret set SENDGRID_API_KEY
gh secret set GOOGLE_ANALYTICS_ID

# AWS Configuration
echo "Setting up AWS secrets..."
gh secret set AWS_ACCESS_KEY_ID
gh secret set AWS_SECRET_ACCESS_KEY
gh secret set AWS_S3_BUCKET --env production
gh secret set AWS_S3_BUCKET --env staging

# Application Configuration
echo "Setting up app configuration..."
gh secret set JWT_SECRET --env production
gh secret set JWT_SECRET --env staging
gh secret set ENCRYPTION_KEY --env production
gh secret set ENCRYPTION_KEY --env staging

# Monitoring and Logging
echo "Setting up monitoring secrets..."
gh secret set SENTRY_DSN
gh secret set DATADOG_API_KEY
gh secret set NEW_RELIC_LICENSE_KEY

# Deployment
echo "Setting up deployment secrets..."
gh secret set DOCKER_HUB_USERNAME
gh secret set DOCKER_HUB_TOKEN
gh secret set PRODUCTION_SERVER_SSH_KEY

echo "All secrets have been configured!"
echo "Don't forget to update your GitHub Actions workflows to use these secrets."
```

## Using Secrets in GitHub Actions Workflows

Once you've set up your secrets, here's how to use them in your GitHub Actions workflows:

```yaml
# .github/workflows/deploy.yml
name: Deploy Application

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production # This gives access to environment secrets

    steps:
      - uses: actions/checkout@v4

      - name: Set up environment
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          API_KEY: ${{ secrets.API_KEY }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
        run: |
          echo "Setting up application with secrets..."
          # Your deployment commands here

      - name: Deploy to AWS
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 sync ./build s3://${{ secrets.AWS_S3_BUCKET }}
```

## Best Practices and Security Tips

### 1. Secret Naming Conventions

Use consistent and descriptive naming:

```bash
# Good naming conventions
gh secret set DATABASE_URL_PRODUCTION
gh secret set API_KEY_STRIPE_LIVE
gh secret set JWT_SECRET_V2
gh secret set AWS_ACCESS_KEY_DEPLOYMENT

# Avoid generic names
gh secret set SECRET1
gh secret set KEY
gh secret set TOKEN
```

### 2. Environment Separation

Always separate secrets by environment:

```bash
# Environment-specific secrets
gh secret set DATABASE_URL --env production
gh secret set DATABASE_URL --env staging
gh secret set DATABASE_URL --env development

# Shared secrets (use sparingly)
gh secret set GITHUB_TOKEN  # Only for truly shared resources
```

### 3. Regular Secret Rotation

Create a script for regular secret updates:

```bash
#!/bin/bash
# rotate-secrets.sh

echo "Rotating expiring secrets..."

# List of secrets that need regular rotation
rotating_secrets=("JWT_SECRET" "API_KEY" "DATABASE_PASSWORD")

for secret in "${rotating_secrets[@]}"; do
    echo "Rotating $secret..."
    echo "Please enter new value for $secret:"
    gh secret set "$secret"
done
```

### 4. Secret Validation

Create a validation script to ensure all required secrets are set:

```bash
#!/bin/bash
# validate-secrets.sh

required_secrets=("DATABASE_URL" "API_KEY" "JWT_SECRET")
missing_secrets=()

echo "Validating required secrets..."

for secret in "${required_secrets[@]}"; do
    if ! gh secret list | grep -q "$secret"; then
        missing_secrets+=("$secret")
    fi
done

if [ ${#missing_secrets[@]} -eq 0 ]; then
    echo "All required secrets are configured!"
else
    echo "Missing secrets:"
    printf '%s\n' "${missing_secrets[@]}"
    exit 1
fi
```

### 5. Security Considerations

- **Never commit secrets to your repository**: Always use `.gitignore` for any files containing secrets
- **Use environment-specific secrets**: Don't share production secrets with development environments
- **Limit secret access**: Use organization secrets with specific repository access when possible
- **Regular auditing**: Periodically review and clean up unused secrets
- **Monitor secret usage**: Check GitHub Actions logs for any secret-related issues

### 6. Backup and Documentation

Create documentation for your secret management:

```bash
# Project Secrets Documentation

## Repository Secrets
- `DATABASE_URL`: Main database connection string
- `API_KEY`: Third-party API access key
- `JWT_SECRET`: Token signing secret

## Environment Secrets
### Production
- `DATABASE_URL`: Production database
- `STRIPE_SECRET_KEY`: Live Stripe API key

### Staging
- `DATABASE_URL`: Staging database
- `STRIPE_SECRET_KEY`: Test Stripe API key

## Organization Secrets
- `DOCKER_HUB_TOKEN`: Shared Docker Hub access
- `MONITORING_API_KEY`: Shared monitoring service key
```

## Troubleshooting Common Issues

### Issue 1: Permission Denied

```bash
# Error: HTTP 403: Forbidden (write:org)
# Solution: Ensure you have the correct permissions
gh auth refresh --scopes write:org
```

### Issue 2: Secret Not Found in Workflow

```bash
# Check if secret exists
gh secret list

# Verify environment configuration
gh secret list --env production
```

### Issue 3: Special Characters in Secrets

```bash
# For secrets with special characters, use file input
echo 'complex!@#$%^&*()secret' > temp_secret.txt
gh secret set COMPLEX_SECRET < temp_secret.txt
rm temp_secret.txt
```

## Conclusion

GitHub CLI transforms secret management from a tedious manual process into an efficient, scriptable workflow. The ability to bulk-create secrets, manage environment-specific configurations, and automate the entire setup process saves significant time and reduces human error.

**Key Benefits Recap:**

- **Time Efficiency**: Set up dozens of secrets in minutes instead of hours
- **Environment Management**: Easily manage different configurations for dev/staging/production
- **Automation Ready**: Script your secret setup for consistent deployments
- **Organization Scale**: Share secrets across multiple repositories seamlessly
- **Security First**: Command-line interface keeps secrets out of browser history and screenshots

Whether you're setting up a new project with many environment variables or managing secrets across multiple environments and repositories, GitHub CLI provides the tools you need for secure, efficient secret management.

The next time you're faced with setting up GitHub Actions secrets for a project, skip the web interface and embrace the power of the command line. Your future self (and your team) will thank you for the time saved and the consistency achieved.

## References

- [GitHub CLI Manual](https://cli.github.com/manual/)
- [GitHub Actions Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub CLI Secret Commands](https://cli.github.com/manual/gh_secret)
