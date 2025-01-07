<script setup lang="ts">
const localePath = useLocalePath();
const props = defineProps<{
  text?: string;
  href?: string;
  target?: string;
  page?: any;
  cssClass?: string;
  onClick?: () => void;
  cta?: boolean;
}>();

const pageTo = computed(() => {
  if (!props.page) {
    return props.href;
  }
  if (props.page.slug === "home") {
    return localePath({ name: "index" });
  }
  const prefix =
    props.page.type === "page" ? "slug" : `${props.page.type}-slug`;
  const data = { name: prefix, params: { slug: props.page.slug } };
  return localePath(data);
});
</script>
<template>
  <nuxt-link
    v-if="page"
    :to="pageTo"
    class="hoverable"
    :class="`${cssClass ? cssClass : 'n-link'} ${cta ? 'button button--stroke' : ''}`"
    :data-block="cta ? 'button' : null"
    :title="page.name"
    @click="onClick"
  >
    <span v-if="cta" class="button__flair"></span>
    <span v-if="text" class="button__label">{{ text }}</span>
    <slot v-else />
  </nuxt-link>
  <a
    v-else-if="href && text"
    :href="href"
    :target="target"
    class="hoverable"
    :class="`${cssClass ? cssClass : 'n-link'} ${cta ? 'button button--stroke' : ''}`"
    :data-block="cta ? 'button' : null"
    @click="onClick"
  >
    <span v-if="cta" class="button__flair"></span>
    <span class="button__label">{{ text }}</span></a
  >
  <a
    v-else-if="href"
    :href="href"
    :target="target"
    class="hoverable"
    :class="`${cssClass ? cssClass : 'n-link'} ${cta ? 'button button--stroke' : ''}`"
    @click="onClick"
    ><span v-if="cta" class="button__flair"></span><slot
  /></a>
</template>
