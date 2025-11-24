---
title: "Serverless Express API Development: Complete Guide (Comprehensive Version)"
description: "Complete comprehensive guide to building Node.js Express APIs with Serverless Framework. Covers setup, development workflow, and production deployment in one detailed article."
pubDatetime: 2025-11-21T13:34:47+05:30
postSlug: node-express-api-development-with-serverless-framework-for-aws-and-local
featured: false
draft: true
tags:
  - AWS
  - Serverless
  - NodeJS
  - Express
  - Lambda
---

![photo by Manoa Angelo(https://unsplash.com/@manrason?utm_source=templater_proxy&utm_medium=referral) on Unsplash](https://images.unsplash.com/photo-1760822396234-631ee5d97a67?crop=entropy&cs=srgb&fm=jpg&ixid=M3w2NDU1OTF8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NjM3MTIyODh8&ixlib=rb-4.1.0&q=85&w=900&h=300)

> **📚 New Series Available!** This comprehensive guide has been split into a more digestible **three-part series** for better learning experience:
>
> - **[Part 1: Getting Started with Serverless Framework](/posts/serverless-express-api-part-1-getting-started)** - Setup and basic deployment
> - **[Part 2: Development Workflow](/posts/serverless-express-api-part-2-development-workflow)** - Dev mode vs offline development
> - **[Part 3: Production Deployment](/posts/serverless-express-api-part-3-production-deployment)** - Monitoring, optimization, and CI/CD
>
> **Choose your preferred format:**
>
> - **Series Format** (Recommended): Follow the three-part series for a structured learning path
> - **Comprehensive Guide**: Continue reading this complete guide for all information in one place

## Table of contents

## TL;DR

Build serverless Express APIs with AWS Lambda using the Serverless Framework:

```bash
# Install Serverless Framework
npm install -g serverless

# Create project using Serverless CLI
serverless

# Follow interactive prompts:
# 1. Select "AWS - Node.js - Express API" template
# 2. Name your service (e.g., my-serverless-api)
# 3. Choose to deploy now or later

# Navigate to project and install additional dependencies
cd my-serverless-api
npm install --save-dev serverless-offline

# Deploy
serverless deploy
```

**Key Configuration:**

```yaml
# serverless.yml
service: my-serverless-api

provider:
  name: aws
  runtime: nodejs20.x
  profile: myproject
  region: us-east-1

functions:
  api:
    handler: handler.handler
    events:
      - httpApi: "*"

plugins:
  - serverless-offline
```

**Benefits:** Zero server management, automatic scaling, pay-per-use pricing, and modern development workflow with real-time AWS integration.

## Introduction

The Serverless Framework eliminates the complexity of deploying and managing serverless applications on AWS Lambda. Instead of configuring infrastructure, you focus on writing Express code while the framework handles deployment, API Gateway setup, and scaling automatically.

This guide demonstrates how to build a production-ready Express API using the Serverless CLI to generate a proper project structure, develop with the new dev mode for real-time AWS integration, and deploy to AWS Lambda with a single command. You'll learn the official Serverless Framework approach to building modern serverless applications with both traditional offline development and the new cloud-connected dev mode.

## Prerequisites

This guide assumes you have:

### 1. Node.js (Required)

Node.js 18.x or higher installed on your system.

```bash
# Verify installation
node --version
# Should output: v18.x.x or higher
```

> **Installation:** Download from [nodejs.org](https://nodejs.org/) or use [nvm](https://github.com/nvm-sh/nvm)

### 2. AWS CLI (Required)

AWS Command Line Interface installed and configured.

```bash
# Verify installation
aws --version
# Should output: aws-cli/2.x.x or higher
```

> **Installation:** Follow the [AWS CLI installation guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

### 3. AWS Credentials (Required)

AWS credentials configured with a profile named `myproject`.

```bash
# Verify configuration
aws sts get-caller-identity --profile myproject

# If not configured, set up credentials
aws configure --profile myproject
```

**Required IAM permissions:**

- `lambda:*` - Lambda function management
- `apigateway:*` - API Gateway configuration
- `cloudformation:*` - Stack management
- `iam:CreateRole`, `iam:AttachRolePolicy` - IAM role creation
- `logs:*` - CloudWatch Logs access

## Step 1: Install Serverless Framework

Install the Serverless Framework globally as recommended in the [official documentation](https://www.serverless.com/framework/docs/getting-started):

```bash
npm install -g serverless
```

Verify installation:

```bash
serverless --version
# Should output: Framework Core: 4.x.x or higher
```

> **Note:** You can also use `npx serverless` if you prefer not to install globally.

## Step 2: Create Your Project

Use the Serverless Framework CLI to create a new project with the recommended template:

```bash
# Create project using Serverless CLI
serverless
```

This command starts an interactive setup process:

1. **Select Template**: Choose "AWS - Node.js - Express API" from the available templates
2. **Service Name**: Enter your service name (e.g., `my-serverless-api`) or press Enter for default
3. **Deployment**: Choose whether to deploy immediately or skip for now

The CLI will create a new directory with your service name and generate all necessary files including:

- `serverless.yml` - Service configuration
- `handler.js` - Lambda function handler with Express setup
- `package.json` - Node.js dependencies and scripts
- `.gitignore` - Git ignore rules

Navigate to your project directory:

```bash
cd my-serverless-api
```

Install additional development dependencies:

```bash
# Development dependency for local testing
npm install --save-dev serverless-offline
```

**Generated files include:**

- **`express`** - Web framework for building APIs (pre-installed)
- **`serverless-http`** - Adapts Express apps for Lambda execution (pre-installed)
- **`serverless-offline`** - Local development server that emulates Lambda (added above)

The generated `package.json` already includes useful scripts:

```json
{
  "name": "my-serverless-api",
  "version": "1.0.0",
  "scripts": {
    "dev": "serverless dev",
    "start": "serverless offline",
    "deploy": "serverless deploy",
    "deploy:dev": "serverless deploy --stage dev",
    "deploy:prod": "serverless deploy --stage production",
    "logs": "serverless logs -f api --tail",
    "remove": "serverless remove"
  },
  "dependencies": {
    "express": "^4.19.2",
    "serverless-http": "^3.2.0"
  },
  "devDependencies": {
    "serverless-offline": "^13.9.0"
  }
}
```

You can add additional scripts if needed, but the generated template provides a solid foundation.

## Step 3: Review and Customize Serverless Configuration

The Serverless CLI has already generated a `serverless.yml` file. Let's review and customize it following the [Serverless Framework conventions](https://www.serverless.com/framework/docs):

```yaml
service: my-serverless-api

provider:
  name: aws
  runtime: nodejs20.x
  profile: myproject
  region: us-east-1
  stage: ${opt:stage, 'dev'}
  memorySize: 512
  timeout: 30

functions:
  api:
    handler: handler.handler
    events:
      - httpApi: "*"

plugins:
  - serverless-offline
```

**Configuration breakdown:**

- **`service`** - Unique identifier for your serverless application
- **`provider.runtime`** - Node.js version (20.x is latest LTS)
- **`provider.profile`** - AWS credentials profile to use
- **`provider.region`** - AWS region for deployment
- **`provider.stage`** - Environment stage (dev, staging, production)
- **`functions.api.handler`** - Path to Lambda handler function
- **`events.httpApi`** - HTTP API event with wildcard routing
- **`plugins`** - serverless-offline for local development

> **Note:** We use `httpApi` instead of `http` for better performance and lower cost. HTTP APIs are the [recommended approach](https://www.serverless.com/framework/docs/providers/aws/events/http-api) for REST APIs.

## Step 4: Review and Customize Express Application

The generated template includes a basic Express application in `handler.js`. Let's review and enhance it with additional features:

```javascript
const serverless = require("serverless-http");
const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Serverless Express API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/users", (req, res) => {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ];
  res.json({ success: true, data: users });
});

app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = {
    id: parseInt(id),
    name: "John Doe",
    email: "john@example.com",
  };
  res.json({ success: true, data: user });
});

app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: "Name and email are required",
    });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json({ success: true, data: newUser });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Export handler for Lambda
module.exports.handler = serverless(app);
```

**Key points:**

- The generated template provides a solid Express foundation
- `serverless-http` wraps the Express app for Lambda compatibility
- All Express middleware and routing works as expected
- Supports all HTTP methods (GET, POST, PUT, DELETE, etc.)
- You can customize this handler with your specific business logic

## Step 5: Review Generated .gitignore

The Serverless CLI has already created a `.gitignore` file. Verify it includes the necessary exclusions:

```gitignore
# Dependencies
node_modules/

# Serverless
.serverless/
.serverless_plugins/

# Environment variables
.env
.env.*
!.env.example

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db
```

## Local Development

The Serverless Framework provides two excellent options for local development:

1. **`serverless dev`** - New dev mode that deploys to AWS and streams logs in real-time
2. **`serverless offline`** - Traditional offline mode that runs completely locally

### Option 1: Dev Mode (Recommended for v4+)

The new `serverless dev` command provides a modern development experience by deploying your function to AWS and streaming logs, errors, and responses directly to your terminal in real-time.

#### Start Dev Mode

```bash
serverless dev
```

**Expected output:**

```
Dev Mode - Watching your service for changes and streaming logs

✔ Service deployed to stack my-serverless-api-dev (45s)

endpoint: ANY - https://abc123xyz.execute-api.us-east-1.amazonaws.com
functions:
  api: my-serverless-api-dev-api

Watching for changes...
```

**Dev mode features:**

- **Real-time deployment** - Code changes trigger automatic redeployment
- **Live AWS environment** - Uses actual AWS Lambda and API Gateway
- **Streaming logs** - See logs, errors, and responses in real-time
- **Fast feedback loop** - Typically redeploys in 10-30 seconds

#### Test Your Dev Mode Endpoints

```bash
# Save the endpoint URL from dev mode output
ENDPOINT="https://abc123xyz.execute-api.us-east-1.amazonaws.com"

# Test endpoints
curl $ENDPOINT/
curl $ENDPOINT/api/users
curl -X POST $ENDPOINT/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Brown","email":"alice@example.com"}'
```

When you make changes to your code, you'll see real-time output like:

```
File changed: handler.js
Deploying...
✔ Service deployed (12s)
```

### Option 2: Offline Mode (Traditional Local Development)

For completely offline development without AWS deployment, use `serverless-offline`:

#### Start Offline Server

```bash
npm start
# or
serverless offline
```

**Expected output:**

```
Starting Offline at stage dev (us-east-1)

Server ready: http://localhost:3000 🚀

Routes for api:
ANY /{proxy*}
```

The server runs on `http://localhost:3000` by default.

#### Test Your Offline Endpoints

```bash
# Root endpoint
curl http://localhost:3000/

# List users
curl http://localhost:3000/api/users

# Get single user
curl http://localhost:3000/api/users/1

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Brown","email":"alice@example.com"}'
```

**Offline development features:**

- **Hot reloading** - Changes to `handler.js` automatically restart the server
- **Fast iteration** - Test changes instantly without deployment
- **Full Express functionality** - All middleware and routing works locally
- **Environment detection** - Check `process.env.IS_OFFLINE` to detect local mode
- **No AWS costs** - Runs completely locally without AWS resources

### Choosing Between Dev Mode and Offline Mode

| Feature               | Dev Mode (`serverless dev`)            | Offline Mode (`serverless offline`)  |
| --------------------- | -------------------------------------- | ------------------------------------ |
| **Environment**       | Real AWS Lambda + API Gateway          | Local Node.js process                |
| **AWS Costs**         | Minimal (dev usage)                    | None                                 |
| **Internet Required** | Yes                                    | No                                   |
| **Deployment Speed**  | 10-30 seconds                          | Instant                              |
| **AWS Services**      | Full access (DynamoDB, S3, etc.)       | Mock/local only                      |
| **Production Parity** | High                                   | Medium                               |
| **Best For**          | Integration testing, AWS service usage | Quick iteration, offline development |

**Recommendation:** Use `serverless dev` for most development work, especially when integrating with other AWS services. Use `serverless offline` for rapid prototyping or when working without internet access.

#### Customize Offline Port

```bash
# Run offline mode on different port
serverless offline --httpPort 4000
```

#### Dev Mode Configuration

Dev mode automatically uses your AWS region and stage settings from `serverless.yml`. You can customize the stage:

```bash
# Use different stage for dev mode
serverless dev --stage development
```

## Deployment

Deploy your serverless API to AWS Lambda following the [Serverless Framework deployment guide](https://www.serverless.com/framework/docs/providers/aws/guide/deploying).

### Deploy to Development

```bash
npm run deploy:dev
```

Or using the Serverless CLI:

```bash
serverless deploy --stage dev
```

**Deployment output:**

```
Deploying "my-serverless-api" to stage "dev" (us-east-1)

✔ Service deployed to stack my-serverless-api-dev (112s)

endpoint: ANY - https://abc123xyz.execute-api.us-east-1.amazonaws.com
functions:
  api: my-serverless-api-dev-api (1.5 MB)
```

**What happens during deployment:**

1. Code is packaged and zipped
2. CloudFormation stack is created/updated
3. Lambda function is deployed
4. HTTP API Gateway is configured
5. IAM roles are set up
6. API endpoint URL is returned

### Deploy to Production

```bash
npm run deploy:prod
```

Each stage creates isolated resources:

- Separate Lambda functions
- Separate API Gateway endpoints
- Separate CloudFormation stacks

### Test Deployed API

```bash
# Save endpoint URL
ENDPOINT="https://abc123xyz.execute-api.us-east-1.amazonaws.com"

# Test endpoints
curl $ENDPOINT/
curl $ENDPOINT/api/users
curl -X POST $ENDPOINT/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob Wilson","email":"bob@example.com"}'
```

## Monitoring and Logs

### View Real-time Logs

Monitor your Lambda function using the [Serverless Framework logging commands](https://www.serverless.com/framework/docs/providers/aws/cli-reference/logs):

```bash
# Tail logs in real-time
npm run logs

# Or with full command
serverless logs -f api --tail

# View logs for production
serverless logs -f api --stage production --tail

# View logs from last hour
serverless logs -f api --startTime 1h
```

**Log output example:**

```
2025-11-21 10:30:15.123 START RequestId: abc-123-def
2025-11-21 10:30:15.234 GET /api/users
2025-11-21 10:30:15.345 END RequestId: abc-123-def
2025-11-21 10:30:15.456 REPORT Duration: 45.67ms Memory: 78MB
```

### CloudWatch Metrics

Access detailed metrics in AWS CloudWatch Console:

- **Invocations** - Number of function calls
- **Duration** - Execution time per request
- **Errors** - Failed executions
- **Throttles** - Rate limiting events

## Configuration Options

### Environment Variables

Add environment variables in `serverless.yml`:

```yaml
provider:
  environment:
    NODE_ENV: production
    API_VERSION: v1
    LOG_LEVEL: ${env:LOG_LEVEL, 'info'}
```

Access in your code:

```javascript
app.get("/config", (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    apiVersion: process.env.API_VERSION,
    isOffline: process.env.IS_OFFLINE === "true",
  });
});
```

### Adjust Lambda Settings

Optimize performance based on your needs:

```yaml
provider:
  memorySize: 1024 # 128-10240 MB (affects CPU allocation)
  timeout: 60 # 1-900 seconds
```

**Memory recommendations:**

- Simple APIs: 256-512 MB
- Standard workloads: 512-1024 MB
- Heavy processing: 1024+ MB

### CORS Configuration

Enable CORS for cross-origin requests:

```yaml
functions:
  api:
    events:
      - httpApi:
          path: "*"
          method: "*"
          cors:
            allowedOrigins:
              - https://yourdomain.com
            allowedHeaders:
              - Content-Type
              - Authorization
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
```

## Best Practices

### 1. Keep Functions Lightweight

Minimize cold start times by reducing package size:

```bash
# Remove dev dependencies before deploy
npm prune --production

# Check package size
du -sh node_modules/
```

### 2. Implement Proper Error Handling

Always catch and handle errors:

```javascript
app.post("/api/users", async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create user",
    });
  }
});
```

### 3. Use Appropriate HTTP Status Codes

```javascript
res.status(200).json({ data }); // OK
res.status(201).json({ data }); // Created
res.status(400).json({ error }); // Bad Request
res.status(404).json({ error }); // Not Found
res.status(500).json({ error }); // Server Error
```

### 4. Structure for Scalability

For larger applications, organize your code:

```
my-serverless-api/
├── src/
│   ├── routes/
│   │   ├── users.js
│   │   └── index.js
│   ├── middleware/
│   │   └── validation.js
│   └── utils/
│       └── logger.js
├── handler.js
├── serverless.yml
└── package.json
```

### 5. Add Health Checks

Essential for monitoring:

```javascript
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
```

## Understanding the Architecture

```
Client Request
     ↓
HTTP API Gateway
     ↓
Lambda Function (Express app via serverless-http)
     ↓
Response via API Gateway
     ↓
Client
```

**Request flow:**

1. Client makes HTTP request to API Gateway
2. API Gateway triggers Lambda function
3. `serverless-http` converts Lambda event to Express request
4. Express app processes request using standard middleware/routes
5. Express returns response
6. `serverless-http` converts Express response to Lambda format
7. API Gateway returns response to client

**Key differences between local and Lambda:**

| Aspect      | Local (serverless-offline) | Lambda (Production)  |
| ----------- | -------------------------- | -------------------- |
| Execution   | Node.js process            | AWS Lambda container |
| Cold starts | None                       | Yes (first request)  |
| Environment | `IS_OFFLINE=true`          | `IS_OFFLINE` not set |
| Logs        | Terminal/console           | CloudWatch Logs      |
| Cost        | Free                       | Pay per request      |

## Cost Optimization

### Lambda Pricing

AWS Lambda pricing consists of:

**1. Request charges:** $0.20 per 1 million requests  
**2. Duration charges:** Based on memory × execution time

**Example calculation (100K requests/month):**

```
Memory: 512 MB
Duration: 100ms average
Requests: 100,000/month

Request cost: 100,000 / 1,000,000 × $0.20 = $0.02
Duration cost: 100,000 × 0.1s × $0.0000002083 × (512/1024) = $0.10

Total: $0.12 per month
```

### AWS Free Tier

Lambda Free Tier (permanent) includes:

- **1 million requests per month**
- **400,000 GB-seconds of compute time per month**

**Most small to medium APIs run completely free!**

### HTTP API vs REST API

We use HTTP API in this guide because it offers:

- **70% cost reduction** compared to REST API
- **Better performance** (lower latency)
- **Simpler configuration**

Learn more in the [HTTP API documentation](https://www.serverless.com/framework/docs/providers/aws/events/http-api).

## Troubleshooting

### Dev Mode Issues

**Issue:** Dev mode deployment fails or is slow.

**Solution:** Ensure you have proper AWS credentials and internet connectivity:

```bash
# Verify AWS credentials
aws sts get-caller-identity --profile myproject

# Check if you're in the correct directory
ls serverless.yml

# Try with verbose output for debugging
serverless dev --verbose
```

**Issue:** Dev mode costs concerns.

**Solution:** Dev mode uses minimal AWS resources during development. To minimize costs:

- Use dev mode only during active development
- Stop dev mode when not needed (Ctrl+C)
- Consider using `serverless offline` for basic testing

### Cold Starts

**Issue:** First request after idle period is slow.

**Solution:** Use provisioned concurrency for critical endpoints:

```yaml
functions:
  api:
    provisionedConcurrency: 1 # Keep 1 instance warm
```

Or implement periodic warmup:

```yaml
functions:
  api:
    events:
      - httpApi: "*"
      - schedule:
          rate: rate(5 minutes)
          input:
            path: /health
```

### Deployment Failures

**Issue:** Deployment fails with permission errors.

**Solution:** Verify IAM permissions:

```bash
# Check your AWS identity
aws sts get-caller-identity --profile myproject

# Ensure your IAM user has required permissions
```

### Timeout Errors

**Issue:** Requests timeout after 30 seconds.

**Solution:** Increase timeout in `serverless.yml`:

```yaml
provider:
  timeout: 60
```

### Large Package Size

**Issue:** Deployment package exceeds size limits.

**Solution:** Optimize dependencies:

```bash
# Remove dev dependencies
npm prune --production

# Consider using Lambda layers for large dependencies
```

## Removing Resources

Clean up AWS resources when done:

```bash
# Remove dev stage
serverless remove --stage dev

# Remove production stage
serverless remove --stage production
```

**Warning:** This permanently deletes all resources including Lambda functions, API Gateway, and CloudWatch logs.

## CI/CD Integration

Automate deployments with GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Install Serverless Framework
        run: npm install -g serverless

      - name: Deploy to Dev
        if: github.ref == 'refs/heads/develop'
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: serverless deploy --stage dev

      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: serverless deploy --stage production
```

## Conclusion

You've successfully built and deployed a serverless Express API using the Serverless Framework. This approach provides:

- **Zero infrastructure management** - Focus on code, not servers
- **Automatic scaling** - Handle any traffic level
- **Cost optimization** - Pay only for actual usage
- **Rapid deployment** - From code to production in seconds
- **Local development** - Test thoroughly before deploying

**What we built:**

- ✅ Express REST API with CRUD operations
- ✅ Modern dev mode with real-time AWS integration
- ✅ Traditional offline development environment
- ✅ Production deployment to AWS Lambda
- ✅ Multi-stage support (dev/production)
- ✅ Monitoring with CloudWatch

The Serverless Framework handles the complexity of AWS infrastructure while you focus on building features. Whether you're creating a small API or a complex microservices architecture, this foundation scales effortlessly.

## Additional Resources

- [Serverless Framework Documentation](https://www.serverless.com/framework/docs/getting-started)
- [Serverless Framework AWS Guide](https://www.serverless.com/framework/docs/providers/aws/guide/intro)
- [HTTP API Events Documentation](https://www.serverless.com/framework/docs/providers/aws/events/http-api)
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [Express.js Documentation](https://expressjs.com/)
- [serverless-offline Plugin](https://github.com/dile/serverless-offline)

## Quick Reference

```bash
# Installation & Project Creation
npm install -g serverless
serverless                         # Create new project interactively

# Local Development
npm run dev                        # Start dev mode (recommended)
serverless dev                     # Alternative dev mode command
npm start                          # Start offline mode
serverless offline                 # Alternative offline command

# Deployment
serverless deploy --stage dev      # Deploy to dev
serverless deploy --stage production  # Deploy to production

# Monitoring
serverless logs -f api --tail      # View real-time logs
serverless logs -f api --startTime 1h  # View last hour

# Cleanup
serverless remove --stage dev      # Remove all resources
```

Happy coding! 🚀
