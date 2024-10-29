<script setup lang="ts">
import Page from "~/components/AppPage.vue";

const route = useRoute();
watch(() => route.params.slug, () => {
  console.log("slug", route.params.slug);
});
</script>
<template>
  <Page slug="home" type="page" />
</template>
