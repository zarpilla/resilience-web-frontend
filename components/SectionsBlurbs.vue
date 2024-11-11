<script setup lang="ts">
const { $gsap, $ScrollTrigger, $Observer } = useNuxtApp();
const props = defineProps<{
  section: any;
}>();

onMounted(() => {

  // when the viewport enter at the middle of the section, get all .blur circle, .blur path and .blur ellipse and set opacity to 1 randomnly, during 5 seconds, using $gsap
  const elements = $gsap.utils.toArray('.blurb path, .blurb circle, .blurb ellipse');
  
  // set elements opacity to 0.2
  $gsap.set('.blurb path, .blurb circle, .blurb ellipse', {
    opacity: 0,
  });

  // set elements opacity to 1 at a random start time between 1 and 8 seconds
  elements.forEach((element: any) => {
    $gsap.to(element, {
      opacity: 1,
      duration: 0.5,
      delay: Math.random() * 5 + 1,

      scrollTrigger: {
        trigger: '.section-blurbs',
        start: 'top bottom',
        end: 'bottom top',
        //scrub: true,
      },
      // repeat: -1,
      // yoyo: true,
    });
  });
  


})

const runtimeConfig = useRuntimeConfig();
</script>
<template>
  <div class="section-blurbs">
    <div class="container">
      <div v-if="section.title">
        <h3 class="text-left mb-5">
          {{ section.title }}
        </h3>        
      </div>
      <div v-if="section.blurbs && section.blurbs.length" class="row">
        <div
          v-for="(column, columnIndex) in section.blurbs"
          :key="columnIndex"
          class="col"
          :class="column.styles?.cssClass ?? 'col'"
        >
          <!-- <img
            v-if="column.image && columnIndex > 0"
            :src="runtimeConfig.public.apiBase + column.image.url"
            :alt="column.image.alternativeText"
            class="mb-3"
          /> -->
          <div class="blurb" v-html="column.svg"></div>


          <h1 v-if="column.title && column.titleHeading === 'h1'" v-html="column.title">
          </h1>
          <h2 v-if="column.title && column.titleHeading === 'h2'" v-html="column.title">
          </h2>
          <h3 v-if="column.title && column.titleHeading === 'h3'" v-html="column.title">
          </h3>
          <h4 v-if="column.title && column.titleHeading === 'h4'" v-html="column.title">
          </h4>
          <h5 v-if="column.title && column.titleHeading === 'h5'" v-html="column.title">
          </h5>
          <p v-if="column.title && column.titleHeading === 'p'" v-html="column.title">
          </p>
          <div
            v-for="(block, index) in column.text"
            :key="index"
            :style="`padding: ${column?.styles?.padding ?? '0'};
          margin: ${column?.styles?.margin ?? 'inherit'}`"
          >
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

          <div
            v-if="column.c2a"
            :style="`padding: ${column?.styles?.padding ?? '0'};
          margin: ${column?.styles?.margin ?? 'inherit'}`"
          >
            <MetaC2A :c2a="column.c2a" :section="section" />
          </div>
        </div>
      </div>

      <!-- <pre>{{ section }}</pre> -->
    </div>
  </div>
</template>
<style scoped lang="scss">
.section-blurbs {
  .col {
    text-align: center
  }
  img{
    height: 120px;
  }

  .blurb path, .blurb circle, .blurb ellipse {
    opacity: 0;
  }
  
}
</style>
