<script setup lang="ts">
const { $api } = useNuxtApp()
const { locale, setLocale, availableLocales } = useI18n()

const headerStore = useHeaderStore()
const footerStore = useFooterStore()


availableLocales.forEach(async loc => {
  await headerStore.fetch(loc)  
  await footerStore.fetch(loc)
});


</script>
<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
