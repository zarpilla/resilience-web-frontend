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

const sectionIsScroller = computed(() => {
  return props.section.__component === "sections.scroller";
});

const backgroundImageStyle = computed(() => ({
  backgroundImage: props.section.styles?.backgroundImage
    ? `url(${
        runtimeConfig.public.apiBase + props.section.styles?.backgroundImage.url
      })`
    : "none",
}));


const backgroundColorStyle = computed(() => ({
  backgroundColor: props.section.styles?.backgroundColor
    ? props.section.styles?.backgroundColor
    : null,
}));

const heightStyle = computed(() => ({
  height: props.section.styles?.height ? props.section.styles?.height : "auto",
}));

const widthStyle = computed(() => ({
  width: props.section.styles?.width ? props.section.styles?.width : null,
}));

const marginStyle = computed(() => ({
  margin: props.section.styles?.margin ? props.section.styles?.margin : null,
}));

const paddingStyle = computed(() => ({
  padding:
    props.section.styles?.padding !== undefined
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
    } width-container-${props.section.styles?.container ?? 'null'} ${
      section.styles?.cssClass ?? 'css-z'
    } ${sectionIsScroller ? 'background-attachment-fixed' : ''}`"
    :style="[
      backgroundStyle,
      backgroundImageStyle,
      backgroundColorStyle,
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
  width: auto !important;
}
.width-container-narrow {
  width: 100% !important;
}
.border-bottom-black-50 {
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
}
</style>

<style lang="scss">


.width-container-narrow {
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 768px) {
  }
  @media (min-width: 992px) {
    .container {
      max-width: 700px !important;
    }
  }
  @media (min-width: 1200px) {
    .container {
      max-width: 1046px !important;
    }
  }
  @media (min-width: 1400px) {
    .container {
      max-width: 1046px !important;
    }
  }
}

.width-container-article {
  margin-left: auto;
  margin-right: auto;
  padding: 0;

  @media (min-width: 768px) {
  }
  @media (min-width: 992px) {
    .container {
      max-width: 800px !important;
    }
  }
  @media (min-width: 1200px) {
    .container {
      max-width: 800px !important;
    }
  }
  @media (min-width: 1400px) {
    .container {
      max-width: 800px !important;
    }
  }
}


.width-container-small {
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 768px) {
  }
  @media (min-width: 992px) {
    .container {
      max-width: 550px !important;
    }
  }
  @media (min-width: 1200px) {
    .container {
      max-width: 650px !important;
    }
  }
  @media (min-width: 1400px) {
    .container {
      max-width: 650px !important;
    }
  }
}


.width-pct80 .container .row {
  width: 80% !important;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  @media screen and (max-width: 768px) {
    width: 100% !important;
  }
}
.width-pct50 .container .row {
  width: 50% !important;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
}
.width-pct80 .section-hero {
  width: 80% !important;
  margin-left: auto;
  margin-right: auto;
  @media screen and (max-width: 768px) {
    width: 100% !important;
  }
}
.width-pct50 .section-hero {
  width: 50% !important;
  margin-left: auto;
  margin-right: auto;
}
</style>
