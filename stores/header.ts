import { defineStore } from 'pinia'

interface Header {
    locale: string;
    value: any;
}
export const useHeaderStore = defineStore('headerStore', {
    state: () => ({
      headers: [] as Header[],
    }),
    actions: {
      async fetch(locale: string) {
        const populate = {
          "populate[0]": "logo",
          "populate[1]": "logoLink",
          "populate[2]": "emailLink",
          "populate[3]": "social",
          "populate[4]": "mainMenu",
          "populate[5]": "secondaryMenu",
        
        }
        const { data: header } = await useAPI('/api/header', { query: { locale, ...populate } })
        this.headers.push({ locale: locale, value: JSON.parse(JSON.stringify(header.value)) })  
      }
    },
    getters: {
        header(): Header  {
            const { locale } = useI18n()
            return this.headers.find((h: Header) => h.locale === locale.value)?.value
        }
    }
  })