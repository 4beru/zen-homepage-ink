# Zen Space website

Creative software studio designing and engineering distinctive websites and digital products.


Built with Nuxt, Tailwind CSS, GSAP, and custom motion design.


## Licensing

This repository does not currently include a project-level license file. Do not assume that the source code, content, visual design, branding, or media may be reused or redistributed. Third-party assets may have their own license terms; obtain permission from the relevant rights holder before reuse.

## Overview

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Vercel and SEO

Set `APP_URL` in the Vercel **Production** environment to the canonical public origin, for example `https://your-domain.example` (replace the example with the real domain and omit the trailing slash). The Nuxt configuration can fall back to Vercel's deployment URL variables, but the configured custom domain should be the canonical origin for production SEO.

Vercel Preview deployments use their own deployment URL and are marked `noindex, nofollow`. The `/robots.txt` endpoint includes the sitemap URL; after deployment, verify both `/robots.txt` and `/sitemap.xml`.

Before launch, run `npm run build` and verify that each localized route returns the expected title, description, canonical URL, `hreflang` links, and project-specific social image.
