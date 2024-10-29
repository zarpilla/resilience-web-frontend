import { defineStore } from 'pinia'

export const useModeStore = defineStore('modeStore', {
    state: () => ({
      pageHeaderColorMode: 'light',
    }),
    actions: {
      setPageHeaderColorMode(mode: string) {
        this.pageHeaderColorMode = mode
      },
    },    
  })