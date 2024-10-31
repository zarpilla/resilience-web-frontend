<script setup lang="ts">
const localePath = useLocalePath();
const props = defineProps<{
  text?: string;
  href?: string;
  target?: string;
  page?: any;
  cssClass?: string;
  onClick?: () => void;
}>();

const pageTo = computed(() => {
  if (!props.page) {
    return props.href;
  }
  if (props.page.slug === 'home') {
    return localePath({ name: 'index' });
  }
  const prefix = props.page.type === 'page' ? 'slug' : `${props.page.type}-slug`;
  const data = { name: prefix, params: { slug: props.page.slug } }
  return localePath(data)
});

</script>
<template>
  <nuxt-link v-if="page" :to="pageTo" class="hoverable" :class="cssClass || 'n-link'" @click="onClick">
    <span v-if="text">{{ text }}</span>
    <slot v-else />
  </nuxt-link>
  <a v-else-if="href && text" :href="href" :target="target" class="hoverable" :class="cssClass || 'n-link'" @click="onClick"
    ><span>{{ text }}</span></a
  >
  <a v-else-if="href" :href="href" :target="target" class="hoverable" :class="cssClass || 'n-link'" @click="onClick"
    ><slot /></a
  >
</template>
