<script setup lang="ts">
const props = defineProps<{
  section: any;
  sectionIndex: number;
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

const backgroundColorStyle = computed(() => ({
  backgroundColor: props.section.styles?.backgroundColor
    ? props.section.styles?.backgroundColor
    : null,
}));

const route = useRoute();
watch(() => route.name, (newValue, oldValue) => console.log("route.name", newValue, oldValue));

</script>
<template>  
  <div class="section-hero" :class="{ 'first-hero': sectionIndex === 0 && !props.section.styles?.height }">
    <div class="container">
      <div class="section-hero-inner d-flex" :class="`align-${section.align}`" :style="[heightStyle, backgroundImageStyle, backgroundColorStyle]">
        <div>
          <h1 v-if="section.title && section.titleHeading === 'h1'" v-html="section.title">
          </h1>
          <h2 v-if="section.title && section.titleHeading === 'h2'" v-html="section.title">
          </h2>
          <h3 v-if="section.title && section.titleHeading === 'h3'" v-html="section.title">
          </h3>
          <h4 v-if="section.title && section.titleHeading === 'h4'" v-html="section.title">
          </h4>
          <h5 v-if="section.title && section.titleHeading === 'h5'" v-html="section.title">
          </h5>
          <p v-if="section.title && section.titleHeading === 'p'" v-html="section.title">
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

  &.first-hero {
    @media screen and (max-width: 768px) {
      padding-top: 100px;
      
    }
  }
}
.section-hero-inner{
  padding: 100px 0;
  @media screen and (max-width: 768px) {
    padding: 50px 0;    
  }
}
.align-bottom-left {
  text-align: left;
  align-items: flex-end;
}
.align-centered {
  text-align: center;
  align-items: center;  
  margin: auto;
  justify-content: center;
}
</style>
