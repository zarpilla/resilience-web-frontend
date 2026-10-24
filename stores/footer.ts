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
            // useI18n() only works at the top of setup(); getters run anywhere
      const locale = useNuxtApp().$i18n.locale;
            return this.footers.find((h: Header) => h.locale === locale.value)?.value
        }
    }
  })