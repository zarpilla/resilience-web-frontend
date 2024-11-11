// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },

  runtimeConfig: {
    apiBase: process.env.API_BASE_URL,
    public: {
      apiBase: process.env.API_BASE_URL || "http://localhost:1337",
      apiToken: process.env.API_TOKEN,
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/_base.scss" as *;',
        },
      },
    },
  },
  plugins: ["~/plugins/api.ts", "~/plugins/theme.client.ts", "~/plugins/bootstrap.client.ts"],
  modules: ["@nuxtjs/i18n", "@pinia/nuxt", "@hypernym/nuxt-gsap", "@nuxt/image"],
  i18n: {
    //locales: ['en', 'ca', 'es'],
    detectBrowserLanguage: false,    
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'ca', language: 'ca-ES' },
      { code: 'es', language: 'es-ES' },
    ],
    defaultLocale: "ca",
    vueI18n: "./i18n.config.ts",
    baseUrl: process.env.BASE_URL,
  },
  css: ["bootstrap/dist/css/bootstrap.min.css"],
  gsap: {
    extraPlugins: {
      scrollTrigger: true,
      scrollTo: true,
      observer: true,
    }
  },
  image: {
    strapi: {
      baseURL: process.env.API_BASE_URL + '/uploads/'
    }
  }
});