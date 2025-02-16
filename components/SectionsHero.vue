<script setup lang="ts">
const props = defineProps<{
  section: any;
  sectionIndex: number;
  type: string;
}>();

import { computed } from "vue";

const runtimeConfig = useRuntimeConfig();

const heightStyle = computed(() => ({
  height: props.section.styles?.height ? props.section.styles?.height : "auto",
}));

const backgroundImageStyle = computed(() => ({
  backgroundImage: props.section.backgroundImage?.url
    ? `url(${runtimeConfig.public.apiBase + props.section.backgroundImage.url})`
    : "none",
}));

const backgroundColorStyle = computed(() => ({
  backgroundColor: props.section.styles?.backgroundColor
    ? props.section.styles?.backgroundColor
    : null,
}));

const isScope = computed(() => props.type === "scope");
const isService = computed(() => props.type === "service");
const isCapability = computed(() => props.type === "capability");
</script>
<template>
  <div
    class="section-hero"
    :class="{
      'first-hero': sectionIndex === 0 && !props.section.styles?.height,
    }"
  >
    <div class="container">
      <div class="row" v-if="isScope || isService">
        <div class="col-12 col-lg-5">
          <div
            class="section-hero-inner d-flex"
            :class="`align-${section.align}`"
            :style="[heightStyle, backgroundImageStyle, backgroundColorStyle]"
          >
            <div class="scope-hero">
              <b class="scope-title" v-if="isScope">ÀMBITS</b>
              <b class="scope-title" v-if="isService">SERVEIS</b>
              <MetaTitleSubTitle :section="section" :type="type" />
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-7"></div>
      </div>
      <div
        v-else
        class="section-hero-inner d-flex"
        :class="`align-${section.align}`"
        :style="[heightStyle, backgroundImageStyle, backgroundColorStyle]"
      >
        <div>
          <div class="scope-hero-capability" v-if="isCapability">
            <b class="scope-title">CAPABILITATS</b>
          </div>
          <MetaTitleSubTitle :section="section" :type="type" />
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
  .bold {
    font-weight: 500;
  }
}
.section-hero-inner {
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
.scope-hero {
  .scope-title {
    color: var(--Negre, #000);
    font-family: "PP Neue Montreal";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 70px; /* 437.5% */
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }
}
.scope-hero-capability{
  .scope-title {
    font-family: "PP Neue Montreal";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 70px; /* 437.5% */
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }
}
</style>
<style lang="scss">
.section-inner-type-scope,
.section-inner-type-service {
  .align-centered {
    text-align: left;
  }
  .scope-title {
    text-align: left !important;
    margin-top: 2rem;
  }
  h1 {
    margin-bottom: 3rem;
  }
  .scope-hero {
    p {
      color: var(--Negre, #000);
      font-family: "Queens";
      font-size: 26px;
      font-style: normal;
      font-weight: 500;
      line-height: 130%; /* 33.8px */
      letter-spacing: 0.26px;
    }
  }
}
</style>
