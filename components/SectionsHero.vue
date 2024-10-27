<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

import { computed } from "vue";

const runtimeConfig = useRuntimeConfig();

const heightStyle = computed(() => ({
  height: props.section.styles?.height ? props.section.styles?.height : "auto",
}));

const backgroundImageStyle = computed(() => ({
  backgroundImage: props.section.backgroundImage?.url
    ? `url(${
        runtimeConfig.public.apiBase + props.section.backgroundImage.url
      })`
    : "none",
}));

</script>
<template>
  <div class="section-hero">
    <div class="container">
      <div class="section-hero-inner d-flex" :class="`align-${section.align}`" :style="[heightStyle, backgroundImageStyle]">
        <div>
          <h1 v-if="section.title && section.titleHeading === 'h1'">
            {{ section.title }}
          </h1>
          <h2 v-if="section.title && section.titleHeading === 'h2'">
            {{ section.title }}
          </h2>
          <h3 v-if="section.title && section.titleHeading === 'h3'">
            {{ section.title }}
          </h3>
          <h4 v-if="section.title && section.titleHeading === 'h4'">
            {{ section.title }}
          </h4>
          <h5 v-if="section.title && section.titleHeading === 'h5'">
            {{ section.title }}
          </h5>
          <p v-if="section.title && section.titleHeading === 'p'">
            {{ section.title }}
          </p>
          <div v-for="(block, index) in section.text" :key="index">
            <h1 v-if="block.type === 'heading' && block.level === 1">
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
              >
                {{ child.text }}
              </span>
            </h1>
            <h2 v-if="block.type === 'heading' && block.level === 2">
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
              >
                {{ child.text }}
              </span>
            </h2>
            <h3 v-if="block.type === 'heading' && block.level === 3">
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
              >
                {{ child.text }}
              </span>
            </h3>
            <h4 v-if="block.type === 'heading' && block.level === 4">
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
              >
                {{ child.text }}
              </span>
            </h4>
            <h5 v-if="block.type === 'heading' && block.level === 5">
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
              >
                {{ child.text }}
              </span>
            </h5>
            <p v-if="block.type === 'paragraph'">
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
              >
                {{ child.text }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.section-hero {
  background-size: cover;
}
.section-hero-inner{
  padding: 100px 0;
}
.align-bottom-left {
  text-align: left;
  align-items: flex-end;
}
.align-centered {
  text-align: center;
  align-items: center;
  width: 80%;
  margin: auto;
}
</style>
