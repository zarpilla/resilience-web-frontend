
export default defineNuxtPlugin((nuxtApp) => {

    const config = useRuntimeConfig();
    const api = $fetch.create({
      baseURL: config.public.apiBase,
      onRequest({ request, options, error }) {
        if (config.public.apiToken) {
          // note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
          options.headers.set('Authorization', `Bearer ${config.public.apiToken}`)
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