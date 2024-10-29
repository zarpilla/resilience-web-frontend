<script setup lang="ts">
const props = defineProps<{
  media: any;
  css?: string;
}>();

const runtimeConfig = useRuntimeConfig();
</script>
<template>
  <img
  v-if="props.media"
    :src="runtimeConfig.public.apiBase + props.media.url"
    :alt="props.media.alternativeText"
    class="img"
    :class="css"
  />
</template>
<style lang="scss" scoped>
.media-border-radius img {
  border-radius: 20px;
}
.img{
    max-width: 100%;
    width: 100%;
}
</style>
