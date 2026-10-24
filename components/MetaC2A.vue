<script setup lang="ts">
const props = defineProps<{
  section: any;
  c2a: any;
}>();

// Button "style" (dropdown in Strapi) -> CSS classes. These are the combinations
// documented in the manual (05-estils.md, Botons). cssClass, if any, is added
// after them. Old buttons without style keep using cssClass alone.
const STYLES: Record<string, string> = {
  normal: "btn mt-4 btn-with-arrow-right",
  negre: "btn mt-4 btn-dark btn-with-arrow-right",
  fosc_vora_blanca: "btn mt-4 btn-dark btn-dark-border-white btn-with-arrow-right",
  fosc_blanc: "btn mt-4 btn-white btn-dark-border-white btn-with-arrow-right",
  negre_crema: "btn mt-4 btn-dark btn-hover-cream btn-with-arrow-right",
  fletxa_avall: "btn mt-4 btn-with-arrow-down",
};

const cssClass = computed(() => {
  const c = props.c2a || {};
  const style = STYLES[c.style] || (c.cssClass ? "" : STYLES.normal);
  return [style, c.fullWidth ? "w-100" : "", c.cssClass || ""]
    .filter(Boolean)
    .join(" ");
});
</script>
<template>
  <div class="cta">
    <MetaLink
      :page="c2a.page"
      :text="c2a.text"
      :target="c2a.target"
      :href="c2a.href"
      :css-class="cssClass"
      :cta="true"
    />
  </div>
</template>
