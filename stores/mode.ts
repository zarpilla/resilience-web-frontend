import { defineStore } from 'pinia'

interface Header {
    locale: string;
    value: any;
}
export const useModeStore = defineStore('modeStore', {
    state: () => ({
      pageHeaderColorMode: 'light',
    }),
    actions: {
      setPageHeaderColorMode(mode: string) {
        this.pageHeaderColorMode = mode
      }
    },    
  })