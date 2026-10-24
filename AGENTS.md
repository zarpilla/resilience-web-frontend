# Notes for AI agents

This repo is the Nuxt 3 front end of https://resilience.earth. Content comes from the Strapi 5
backend (`resilience-web-backend`), where the documentation lives:

- Editor manual (Catalan): `resilience-web-backend/docs/manual/`
- Instructions for content-editing agents: `resilience-web-backend/docs/agent/AGENT.md`
- Technical tasks: `resilience-web-backend/docs/tasks/`

Map of this repo:
- `components/AppPage.vue` — builds every page: loads sections, injects `{type}-information`
  and `{type}` / `all` templates, audio player positions.
- `components/AppSection.vue` — wrapper applying `styles` (container, colours, padding...).
- `components/Sections*.vue` — one component per Strapi block (`sections.*`).
- `components/Meta*.vue` — rich text, media, links, buttons.
- `assets/_base.scss`, `_buttons.scss`, `_fonts.scss` — global helper classes used from the CMS `cssClass` fields.
- `pages/*/[slug].vue` — URL prefixes per page type and locale.

When changing code, keep existing pages visually identical (compare screenshots) and update
the manual / agent docs in the backend repo.
