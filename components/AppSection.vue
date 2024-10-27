<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

import { computed } from "vue";

const runtimeConfig = useRuntimeConfig();

const backgroundStyle = computed(() => ({
  background: props.section.styles?.background
    ? props.section.styles?.background
    : "cover no-repeat",
}));

const backgroundImageStyle = computed(() => ({
  backgroundImage: props.section.styles?.backgroundImage
    ? `url(${
        runtimeConfig.public.apiBase + props.section.styles?.backgroundImage.url
      })`
    : "none",
}));

const heightStyle = computed(() => ({
  height: props.section.styles?.height ? props.section.styles?.height : "auto",
}));

const widthStyle = computed(() => ({
  width: props.section.styles?.width ? props.section.styles?.width : "auto",
}));


const marginStyle = computed(() => ({
  margin: props.section.styles?.margin
    ? props.section.styles?.margin
    : null,
}));

const paddingStyle = computed(() => ({
  padding: props.section.styles?.padding !== undefined
    ? props.section.styles?.padding
    : null,
}));
</script>
<template>
  <div
    class="section-inner"
    :id="section.styles?.sectionId ? section.styles?.sectionId : null"
    :class="`section-${section.__component.replace('.', '-')} text-${
      props.section.styles?.textColor ?? 'dark'
    } width-${props.section.styles?.widthList ?? 'auto'} ${section.styles?.cssClass ?? 'css-z'}`"
    :style="[
      backgroundStyle,
      backgroundImageStyle,
      heightStyle,
      marginStyle,
      paddingStyle,
    ]"
  >
    <slot></slot>
  </div>
</template>
<style scoped lang="scss">
.section-inner {
  background-size: 102%;  
  background-repeat: no-repeat;
}
.width-auto {
  width: auto!important;
}
.width-pct100 {
  width: 100%!important;
}
.width-pct80 .container {
  width: 80%!important;
  margin-left: auto;
  margin-right: auto;
}

.border-bottom-black-50{
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
}

</style>

<style lang="scss">
.width-pct80 .container .row {
  width: 80%!important;
  margin-left: auto;
  margin-right: auto;
  text-align: left
}
</style>
