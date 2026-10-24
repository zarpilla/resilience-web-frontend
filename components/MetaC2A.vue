<script setup lang="ts">
const props = defineProps<{
  section: any;
  c2a: any;
}>();
</script>
<template>
  <div class="cta">
    <MetaLink
      :page="c2a.page"
      :text="c2a.text"
      :target="c2a.target"
      :href="c2a.href"
      :css-class="c2a.cssClass"
      :cta="true"
    />
  </div>
</template>
<style lang="scss">
// Column "buttons" list: one under the other, same spacing as the old one-button-per-block layout.
.c2a-list > .cta + .cta,
.c2a-list.has-c2a > .cta:first-child {
  margin-top: 24px;
}
</style>
