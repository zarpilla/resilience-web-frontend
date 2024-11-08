<script setup lang="ts">
const props = defineProps<{
  section: any;
  c2a: any;
}>();


</script>
<template>
    <div class="cta">
        <MetaLink :page="c2a.page" :text="c2a.text" :target="c2a.target" :href="c2a.href" :css-class="c2a.cssClass" />
    </div>
</template>
<style lang="scss">
.cta > a{
  background: #fff;
  background: linear-gradient(to bottom, #fff 50%, #000 50%);
  background-size: 100% 200%;-position: top left;
  transition: all 0.20s ease-in-out;

  &:hover {
    background-position: bottom left;
  }
}
.cta > a.btn-dark{
  background: #000;
  background: linear-gradient(to bottom, #000 50%, #fff 50%);
  background-size: 100% 200%;-position: top left;
  transition: all 0.20s ease-in-out;

  &:hover {
    background-position: bottom left;
  }
}
</style>