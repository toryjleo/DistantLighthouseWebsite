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

The site is automatically deployed to GitHub Pages on every push to `main` via the workflow in `.github/workflows/deploy.yml`.

**To deploy changes:** simply push to `main`. The workflow will build and deploy automatically.

**One-time setup:** In the GitHub repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.

### Local Development

```bash
npm install
npm run dev
```

### Custom Domain (Future)

When ready to connect `distantlighthouse.com`:
1. Add a `public/CNAME` file containing `distantlighthouse.com`
2. Update `base` in `vite.config.js` back to `'/'`
3. Configure DNS in Squarespace (A records + CNAME → `toryjleo.github.io`)
4. In repo Settings → Pages, enter the custom domain and enable HTTPS
