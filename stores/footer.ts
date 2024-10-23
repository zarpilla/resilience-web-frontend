import { defineStore } from 'pinia'

interface Header {
    locale: string;
    value: any;
}
export const useFooterStore = defineStore('footerStore', {
    state: () => ({
      footers: [] as Header[],
    }),
    actions: {
      async fetch(locale: string) {
        const populate = {
          "populate[0]": "primaryLogo",
          "populate[1]": "secondaryLogo",
          "populate[2]": "middleLogos",
          "populate[3]": "menu",
          "populate[4]": "social",
        
        }
        const { data: header } = await useAPI('/api/footer', { query: { locale, ...populate } })
        this.footers.push({ locale: locale, value: JSON.parse(JSON.stringify(header.value)) })  
      }
    },
    getters: {
        header(): Header  {
            const { locale } = useI18n()
            return this.footers.find((h: Header) => h.locale === locale.value)?.value
        }
    }
  })