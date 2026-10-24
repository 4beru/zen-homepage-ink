# Zen Space website

Creative software studio designing and engineering distinctive websites and digital products.


Built with Nuxt, Tailwind CSS, GSAP, and custom motion design.


## License

- **Code:** Licensed under the [MIT License](./LICENSE). See `LICENSE` file.
  You’re free to use, modify, and distribute the source code.

- **Design, content, and branding:** Licensed under the [Creative Commons
  Attribution–NonCommercial–NoDerivatives 4.0 International License (CC BY-NC-ND 4.0)](./LICENSE-DESIGN). See `LICENSE-DESIGN` file.
  These materials may not be used commercially or modified without permission.

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
