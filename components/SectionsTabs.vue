<script setup lang="ts">
const { $gsap, $ScrollTrigger, $Observer } = useNuxtApp();

const props = defineProps<{
  section: any;
}>();

const widthStyle = computed(() => ({
  width: props.section.styles?.width ? props.section.styles?.width : null,
}));

const activeTab = ref(0);

onMounted(() => {
  //https://codepen.io/akapowl/pen/rNeqQzW/4a8ca13036ba9f2f80919f671da1fed0
});
</script>
<template>
  <div class="section-tabs">
    <div class="container">
      <div
        v-if="section.tabs && section.tabs.length"
        class="row"
        :style="widthStyle"
      >
        <div class="col-12 col-md-5">
          <div
            v-for="(column, columnIndex) in section.tabs"
            :key="columnIndex"
            class="col-12 col-md"
            @click="activeTab = columnIndex"
            @mouseenter="activeTab = columnIndex"
            :class="{ active: activeTab === columnIndex }"
          >
            <h1
              v-if="column.title && column.titleHeading === 'h1'"
              v-html="column.title"
            ></h1>
            <h2
              v-if="column.title && column.titleHeading === 'h2'"
              v-html="column.title"
            ></h2>
            <h3
              v-if="column.title && column.titleHeading === 'h3'"
              v-html="column.title"
            ></h3>
          </div>
        </div>
        <div class="col-12 offset-md-1 col-md-6">
          <div
            v-for="(column, columnIndex) in section.tabs"
            :key="columnIndex"
            class="col-12 col-md"
          >
            <div
              class="tab-content"
              :class="{
                'd-none': activeTab !== columnIndex,
                'd-block': activeTab === columnIndex,
              }"
            >
              <p
                v-if="column.title && column.titleHeading === 'p'"
                v-html="column.title"
              ></p>

              <MetaText :text="column.text" :styles="column.styles" />

              <div v-if="column.media" class="media">
                <MetaMedia :media="column.media" />
              </div>

              <div
                v-if="column.c2a"
                :style="`padding: ${column?.styles?.padding ?? '0'};
          margin: ${column?.styles?.margin ?? 'inherit'}`"
              >
                <MetaC2A :c2a="column.c2a" :section="section" />
              </div>              
            </div>
          </div>
        </div>
      </div>

      <!-- <pre>{{ section }}</pre> -->
    </div>
  </div>
</template>
<style scoped lang="scss">
h2 {
  color: var(--white, #FFF);
  font-family: "PP Neue Montreal";
  font-size: 60px;
  font-style: normal;
  font-weight: 400;
  line-height: 70px; /* 116.667% */
  letter-spacing: 0.6px;
  opacity: 0.4;

  &:hover {
    color: var(--Taronja, #f5825e);
    opacity: 1;
  }
}
.active {
  h2 {
    color: var(--Taronja, #f5825e)!important;
    opacity: 1;
  }
}
.tab-content{
  @media screen and (max-width: 768px) {
    padding-top: 50px;    
  }
}
</style>
<style lang="scss">
.section-tabs{
  h3 {
    margin-bottom: 30px!important;
  }
}
</style>

