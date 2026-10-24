
export default defineNuxtPlugin((nuxtApp) => {

    const config = useRuntimeConfig();
    const api = $fetch.create({
      baseURL: config.public.apiBase,
      onRequest({ request, options, error }) {
        // The token is only sent from the server (SSR). Browser requests use the
        // public Strapi role, so no credential ever reaches the client.
        if (import.meta.server && config.apiToken) {
          // note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
          options.headers.set('Authorization', `Bearer ${config.apiToken}`)
        }
      },
      async onResponseError({ response }) {
        // console.error('API error', response)
        if (response.status === 401) {
          //await nuxtApp.runWithContext(() => navigateTo('/login'))
        }
      }
    })
  
    // Expose to useNuxtApp().$api
    return {
      provide: {
        api
      }
    }
  })