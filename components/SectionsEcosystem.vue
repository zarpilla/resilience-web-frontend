<script setup lang="ts">
const { $gsap, $ScrollTrigger, $Observer } = useNuxtApp();

const props = defineProps<{
  section: any;
}>();


onMounted(() => {
  
});
</script>
<template>
  <div
    class="section-video"
  >
    <div class="container">
ecosystem here {{  section }}
    </div>
  </div>
</template>
<style scoped lang="scss">
</style>
