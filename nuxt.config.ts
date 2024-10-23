// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },

  //modules: ['@nuxtjs/axios'],
  runtimeConfig: {
    apiBase: process.env.API_BASE_URL,
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:1337',
      apiToken: process.env.API_TOKEN
    }
  },
  plugins: ['~/plugins/api.ts'],  
  modules: ['@nuxtjs/i18n', '@pinia/nuxt', 'usebootstrap'],
  i18n: {
    locales: ['ca', 'es', 'en'],
    defaultLocale: 'ca',
    vueI18n: './i18n.config.ts',
    // customRoutes: 'config',
    // pages: {
    //   "article-slug": {
    //     ca: '/article/[slug]',
    //     en: '/article/[slug]',
    //     es: '/articulo/[slug]',
    //   },
    // }
  },
  css: ['bootstrap/dist/css/bootstrap.min.css'],
})