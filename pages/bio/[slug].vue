<script setup lang="ts">
import Bio from "~/components/AppBio.vue";
import { useRoute } from "vue-router";

defineI18nRoute({
    paths: {
      en: '/bio/[slug]',
      es: '/bio/[slug]',
      ca: '/bio/[slug]'
    }
  })

const route = useRoute();
const slug = route.params.slug as string;
</script>

<template>
  <Bio :slug="slug" />
</template>
