<script setup lang="ts">
const props = defineProps<{
  section: any;
  type: string;
  index: number;
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

const backgroundImage2Style = computed(() => ({
  backgroundImage:
    props.type !== "scope" &&
    props.type !== "service" &&
    props.section.styles?.backgroundImage2 &&
    !sectionIsScroller.value
      ? `url(${
          runtimeConfig.public.apiBase +
          props.section.styles?.backgroundImage2.url
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
const backgroundVideoUrl = computed(() => {
  return props.section.styles?.backgroundVideo?.url
    ? runtimeConfig.public.apiBase + props.section.styles.backgroundVideo.url
    : null;
});

const backgroundVideoMobileUrl = computed(() => {
  return props.section.styles?.backgroundVideoMobile?.url
    ? runtimeConfig.public.apiBase + props.section.styles.backgroundVideoMobile.url
    : null;
});

const isMobile = computed(() => {
  if (process.client) {
    return window.innerWidth <= 1024;
  }
  return false;
});

const currentVideoUrl = computed(() => {
  if (isMobile.value && backgroundVideoMobileUrl.value) {
    return backgroundVideoMobileUrl.value;
  }
  return backgroundVideoUrl.value;
});
</script>
<template>
  <div
    class="section-inner"
    :id="section.styles?.sectionId ? section.styles?.sectionId : null"
    :class="`section-${section.__component.replace('.', '-')} text-${
      props.section.styles?.textColor ?? 'dark'
    } width-container-${props.section.styles?.container ?? 'null'} ${
      section.styles?.cssClass ?? 'css-z'
    } ${section.styles?.paddingTop === false ? 'pt-0' : 'pt-z'} ${
      section.styles?.paddingBottom === false ? 'pb-0' : 'pb-z'
    } ${
      sectionIsScroller ? 'background-attachment-fixed' : ''
    } section-inner-type-${props.type} ${
      section.styles?.borderBottom ? 'border-bottom-black-50' : ''
    } section-inner-index-${props.index}`"
    :style="[
      backgroundStyle,
      backgroundImageStyle,
      backgroundColorStyle,
      heightStyle,
      marginStyle,
      paddingStyle,
    ]"
  >
    <video
      v-if="currentVideoUrl"
      class="section-background-video"
      :src="currentVideoUrl"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    ></video>
    <div class="section-inner-2" :style="[backgroundImage2Style]">
      <slot></slot>
    </div>
  </div>
</template>
<style scoped lang="scss">
.section-inner {
  background-size: 102%;
  background-repeat: no-repeat;
  position: relative;
  // overflow: hidden;
}
.section-background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
}
.section-inner > .section-inner-2 {
  position: relative;
  z-index: 1;
}
.section-inner-2 {
  background-size: 52%;
  background-repeat: no-repeat;
  background-position: right;
  @media screen and (max-width: 768px) {
    background-size: 100%;
    background-position: center;
  }
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
      max-width: 894px !important;
    }
  }
  @media (min-width: 1400px) {
    .container {
      max-width: 894px !important;
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
.section-inner-type-scope {
  padding-top: 150px;
}
.section-inner-type-scope,
.section-inner-type-service {
  @media screen and (min-width: 769px) {
    // background-position: 50vw 0px!important;
    background-size: 100% !important;
  }
}
.section-inner-type-article {
  @media screen and (min-width: 769px) {
    background-image: none !important;
  }
}
</style>
