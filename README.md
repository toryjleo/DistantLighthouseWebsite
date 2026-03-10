# Distant Lighthouse Website

This is the main marketing and portfolio website for Distant Lighthouse, built with React, Vite, TailwindCSS, and Three.js (React Three Fiber). 

## Technology Stack
- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **3D Graphics**: Three.js / React Three Fiber / React Three Drei (used for the background particle and water shader effects)
- **Infrastructure as Code**: AWS CDK (TypeScript)

## Deployment Instructions

To update the live site, you need to build the production bundle of the React app and then deploy it using the AWS CDK setup located in the `infra` folder.

**CRITICAL NOTE**: You MUST use the `personal` AWS profile to deploy this site.

1. **Build the production bundle:**
   From the root of the project (`/home/tory/Documents/Programming/DistantLighthouse/Website`), run:
   ```bash
   npm run build
   ```
   *(This will bundle your latest code into the `dist` folder)*

2. **Deploy it using AWS CDK:**
   Navigate to the `infra` folder and deploy:
   ```bash
   cd infra
   npx cdk deploy --profile personal
   ```
   *(This will grab the files from `dist`, update your S3 bucket, and invalidate the CloudFront distribution)*

Once the CDK deployment finishes, it may take a few minutes for the CloudFront cache to properly update, after which your changes will be live.
