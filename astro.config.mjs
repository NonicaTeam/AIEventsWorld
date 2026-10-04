// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://aieventsworld.com',
  output: 'static',
  adapter: cloudflare(),
  integrations: [
    sitemap({
      lastmod: new Date(),
      // Newsletter opt-in landing page: never listed in search engines.
      // The bare root only redirects to /en/, so it is left out as well.
      filter: (page) => !page.includes('/subscribed') && page !== 'https://aieventsworld.com/',
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          es: 'es',
          fr: 'fr',
          de: 'de',
          it: 'it',
          nl: 'nl',
        },
      },
    }),
  ],
  i18n: {
    locales: ['en', 'es', 'fr', 'de', 'it', 'nl'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
});
