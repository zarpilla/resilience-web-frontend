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
    <span>{{ text }}</span>
  </nuxt-link>
  <a v-else :href="href" :target="target" class="hoverable" :class="cssClass || 'n-link'" @click="onClick"
    ><span>{{ text }}</span></a
  >
</template>
