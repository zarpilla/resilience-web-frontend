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
        const { data: header } = await useAPI('/api/footer', { query: { locale } })
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