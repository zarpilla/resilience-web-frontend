<script setup lang="ts">
import Page from "~/components/AppPage.vue";
import { useRoute } from "vue-router";

defineI18nRoute({
    paths: {
      en: '/service/[slug]',
      es: '/servicio/[slug]',
      ca: '/servei/[slug]'
    }
  })

const route = useRoute();
const slug = route.params.slug as string;
</script>

<template>
  <Page :slug="slug" type="service" />
</template>
