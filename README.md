# Nuxt Minimal Starter

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

# Build error
```bash
 ERROR  Nuxt Build Error: [commonjs--resolver] [unimport] failed to find "updateSiteConfig" imported from "#imports"     
 file: node_modules/nuxt-site-config/dist/runtime/nuxt/plugins/i18n.server.js
 ```


import { computed, updateSiteConfig, useSiteConfig } from "#imports";
to 
import { computed } from "#imports";
const updateSiteConfig = (input = {}) => {
const useSiteConfig = () => {};