# AWS Static Website CDK Setup Guide

This guide will walk you through deploying a static website (like HTML/JS/CSS, React, Vue, etc.) to AWS. It uses **AWS Cloud Development Kit (CDK)** to provision everything as code. This means instead of clicking around the AWS console, you run a few commands to create your S3 bucket, set up CloudFront (so the site loads lightning fast worldwide), and link your Route 53 domain name so it has a clean URL without random letters/numbers.

---

## Prerequisites

Before starting, make sure you have the following installed and set up:
1. **AWS Account**: Your own active AWS account.
2. **AWS CLI**: Installed and configured. 
   **🚨 CRITICAL STEP - DO NOT SKIP 🚨**
   Since you already have AWS CLI set up for the company account by default, you **MUST** create a separate profile for your personal AWS account to avoid deploying this to the company's AWS!
   - Log into your *personal* AWS Console.
   - Go to **IAM** -> **Users** -> Select your user (or create an admin IAM user) -> **Security credentials** -> **Create access key**.
   - Open your terminal and run: `aws configure --profile personal`
   - Plug in your personal IAM Access Key, Secret Key, and default region (e.g., `us-east-1`). 
   - You will use this `--profile personal` flag in all commands below to ensure it deploys to your personal account.
3. **Node.js**: Installed on your machine.
4. **AWS CDK CLI**: Run `npm install -g aws-cdk` to install it globally.
5. **A Domain Name (Optional for now)**: A domain registered with AWS Route 53 (e.g., `mycoolwebsite.com`). *(Note: Since your domain is still pending approval, we'll deploy the site using a temporary AWS URL first, and then hook up the custom domain in Step 6 once it's approved!)*

---

## Step 1: Initialize the Project 

First, let's create a brand new directory for the infrastructure and website, and initialize a new CDK TypeScript project.

```bash
mkdir my-website
cd my-website

# Initialize the CDK project
cdk init app --language typescript
```

---

## Step 2: Add Your Website Code

Inside your new `my-website` folder, create a directory called `site`. This is where your actual website code will live.

```bash
mkdir site
```

Add an `index.html` file inside the `site` folder:

```html
<!-- site/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome AWS Site</title>
</head>
<body>
    <h1>Hello, World! This is hosted on S3 and CloudFront!</h1>
</body>
</html>
```

*(Note: If you are using React, Vue, or similar, you would build your app and place the output `dist` or `build` folder's contents here.)*

---

## Step 3: Write the Initial Infrastructure Code (Without Custom Domain)

We will first deploy the site to a temporary AWS address (e.g., `d12345abcdef.cloudfront.net`) while you wait for your domain to be approved. 

Open `lib/my-website-stack.ts` in your editor and replace its contents with the code below:

```typescript
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class MyWebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Create the S3 Bucket for the website contents
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, 
      autoDeleteObjects: true, // Automatically deletes files if the bucket is destroyed
    });

    // 2. Create a CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultRootObject: 'index.html',
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      // Note: If you are hosting a Single Page Application (like React), you need to reroute 403/404s to index.html
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        }
      ]
    });

    // Output the temporary CloudFront URL so we can click it after deployment
    new cdk.CfnOutput(this, 'TemporaryUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'Your temporary CloudFront URL',
    });

    // 3. Deploy site contents to S3 Bucket AND invalidate the CloudFront cache
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('./site')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'], // Tells CloudFront to clear the cache so new changes appear instantly
    });
  }
}
```

**Important Account Setting Step:**
AWS CDK needs your AWS Account ID and Region defined. Open `bin/my-website.ts` and ensure your environment is explicitly defined. Uncomment or add the `env` property:

```typescript
// bin/my-website.ts
import * as cdk from 'aws-cdk-lib';
import { MyWebsiteStack } from '../lib/my-website-stack';

const app = new cdk.App();
new MyWebsiteStack(app, 'MyWebsiteStack', {
  // Replace these with your actual AWS Account ID and Region (e.g. 'us-east-1')
  env: { account: '123456789012', region: 'us-east-1' },
});
```

---

## Step 4: Initial Deployment!

You are ready to launch the first version of your site.

1. **Bootstrap CDK**: If this is your first time using CDK in this AWS account/region, run the bootstrap command. This creates a small S3 bucket that AWS CDK uses to hold its deployment assets.
   ```bash
   cdk bootstrap --profile personal
   ```

2. **Deploy the Stack**:
   ```bash
   cdk deploy --profile personal
   ```

The CDK will compile your TypeScript into CloudFormation, then show you a list of security-related changes. Type `y` to accept and start the deployment.

**Wait for it...**
CloudFront distributions usually take around 3 to 10 minutes to deploy fully. 

Once it finishes, it will print an "Outputs" section in your terminal containing `TemporaryUrl` (e.g., `https://d12345abcdef.cloudfront.net`). Go to that URL in your browser to see your website live!

---

## Step 5: How to Update Your Site

Whenever you change your frontend code inside the `site/` folder (while still using the temporary URL or after setting up the custom one), simply run:
```bash
cdk deploy --profile personal
```
CDK intelligently detects the changes, uploads your new files to S3, and clears the CloudFront cache so your users see the final results right away.

---

## Step 6: Hooking Up Your Custom Domain (Once Approved)

When your Route 53 domain name is finally approved, you can easily attach it to your existing site. 

Modify your `lib/my-website-stack.ts` file to include the Route 53 and ACM Certificate configurations. Your final file should look like this:

```typescript
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class MyWebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ==========================================
    // CONFIGURATION
    // ==========================================
    const domainName = 'yourdomain.com'; // <-- CHANGE THIS TO YOUR NEWLY APPROVED DOMAIN
    const siteSubDomain = 'www';

    // 1. Look up the hosted zone in Route 53
    const zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: domainName });

    // 2. Create the S3 Bucket for the website contents
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: `${siteSubDomain}.${domainName}`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, 
      autoDeleteObjects: true,
    });

    // 3. Request a TLS/SSL certificate for HTTPS
    const certificate = new acm.Certificate(this, 'SiteCertificate', {
      domainName: domainName,
      subjectAlternativeNames: [`*.${domainName}`],
      validation: acm.CertificateValidation.fromDns(zone),
    });

    // 4. Create a CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      certificate: certificate, // Added Certificate!
      defaultRootObject: 'index.html',
      domainNames: [domainName, `${siteSubDomain}.${domainName}`], // Added Domain Names!
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        }
      ]
    });

    // 5. Create Route 53 alias records pointing to the CloudFront distribution
    new route53.ARecord(this, 'SiteAliasRecord', {
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone
    });

    new route53.ARecord(this, 'WwwSiteAliasRecord', {
      recordName: `${siteSubDomain}.${domainName}`,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone
    });

    // 6. Deploy site contents and invalidate cache
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('./site')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'], 
    });
  }
}
```

Save the file and run your deploy command again:
```bash
cdk deploy --profile personal
```

Wait another 5-10 minutes for the DNS and CloudFront changes to propagate, and then you can visit `https://yourdomain.com`!
