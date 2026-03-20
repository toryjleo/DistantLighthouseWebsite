# Distant Lighthouse Website

This is the main marketing and portfolio website for Distant Lighthouse, built with React, Vite, TailwindCSS, and Three.js (React Three Fiber). 

## Technology Stack
- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **3D Graphics**: Three.js / React Three Fiber / React Three Drei (used for the background particle and water shader effects)
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## Deployment

The site is deployed to GitHub Pages via GitHub Actions. The workflow in `.github/workflows/deploy.yml` builds the Vite app and publishes the `dist` artifact.

**To deploy changes:** push to `master`. The workflow will build and deploy automatically.

**Required settings:** In the GitHub repo, go to **Settings → Pages** and set **Source** to **GitHub Actions** (not “Deploy from branch”).

### Local Development

```bash
npm install
npm run dev
```

### Custom Domain

The live site uses a custom domain: `www.distantlighthouse.com`. The `public/CNAME` file is already set up, and Pages should show that domain with HTTPS enabled.
