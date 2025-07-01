<script setup lang="ts">
const { $gsap, $ScrollTrigger, $Observer } = useNuxtApp();
const props = defineProps<{
  section: any;
}>();

onMounted(() => {
  // const dots = ".blurb-effect-dots path, .blurb-effect-dots circle, .blurb-effect-dots ellipse, .blurb-effect-null path, .blurb-effect-null circle, .blurb-effect-null ellipse";
  // // when the viewport enter at the middle of the section, get all .blur circle, .blur path and .blur ellipse and set opacity to 1 randomnly, during 5 seconds, using $gsap
  // const elements = $gsap.utils.toArray(dots);
  // // set elements opacity to 0.2
  // $gsap.set(dots, {
  //   opacity: 0,
  // });
  // // set elements opacity to 1 at a random start time between 1 and 8 seconds
  // elements.forEach((element: any) => {
  //   $gsap.to(element, {
  //     opacity: 1,
  //     duration: 0.5,
  //     delay: Math.random() * 5 + 1,
  //     scrollTrigger: {
  //       trigger: ".section-blurbs",
  //       start: "top bottom",
  //       end: "bottom top",
  //       //scrub: true,
  //     },
  //     // repeat: -1,
  //     // yoyo: true,
  //   });
  // });
  // // scrolltrigger to animate the circleMask when .section-blurbs is in the viewport
  // $gsap.set("#circleMask,#circleMaskTWO,#circleMask3", {scale:0, transformOrigin:"center center"});
  // $gsap.set("#toBeRevealed", {scale:0, transformOrigin:"center center"});
  // $ScrollTrigger.create({
  //   trigger: ".section-blurbs",
  //   start: "top bottom",
  //   end: "bottom top",
  //   onEnter: () => {
  //     $gsap.to("#circleMask", {scale:10, transformOrigin:"center center", duration:5, ease:'power3.in'});
  //     $gsap.to("#circleMaskTWO", {scale:5, transformOrigin:"40% 20%", duration:5, ease:'power3.in'});
  //     $gsap.to("#circleMask3", {scale:10, transformOrigin:"47% 53%", duration:9, ease:'power3.in'});
  //     $gsap.to("#toBeRevealed", {
  //     scale: 1,
  //     transformOrigin: "center center",
  //     duration: 5,
  //     ease: 'power3.in',
  //     rotate: (Math.random() - 0.5) * 13
  //     });
  //   },
  //   onLeaveBack: () => {
  //     // $gsap.to("#circleMask", {scale:0, transformOrigin:"center center", duration:5, ease:'power3.in'});
  //     // $gsap.to("#circleMaskTWO", {scale:0, transformOrigin:"40% 20%", duration:5, ease:'power3.in'});
  //     // $gsap.to("#circleMask3", {scale:0, transformOrigin:"center center", duration:9, ease:'power3.in'});
  //   },
  // });
  // $gsap.to("#circleMask", {scale:10, transformOrigin:"center center", duration:5, ease:'power3.in'});
  // $gsap.to("#circleMaskTWO", {scale:5, transformOrigin:"40% 20%", duration:5, ease:'power3.in'});
  // $gsap.to("#circleMask3", {scale:10, transformOrigin:"center center", duration:9, ease:'power3.in'});
});

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
          <img
            v-if="column.image"
            :src="runtimeConfig.public.apiBase + column.image.url"
            :alt="column.image.alternativeText"
            class="mb-3"
          />

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
          <h4
            v-if="column.title && column.titleHeading === 'h4'"
            v-html="column.title"
          ></h4>
          <h5
            v-if="column.title && column.titleHeading === 'h5'"
            v-html="column.title"
          ></h5>
          <h6
            v-if="column.title && column.titleHeading === 'h6'"
            v-html="column.title"
          ></h6>
          <p
            v-if="column.title && column.titleHeading === 'p'"
            v-html="column.title"
          ></p>
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
          ${column?.styles?.margin ? 'margin:' + column?.styles?.margin : ''}`"
          >
            <MetaC2A :c2a="column.c2a" :section="section" />
          </div>
        </div>
      </div>

      <!-- <pre>{{ section }}</pre> -->
    </div>
  </div>
</template>
<style lang="scss">
.section-blurbs {
  .col {
    text-align: center;
    @media screen and (max-width: 768px) {
      margin-bottom: 2rem;      
    }
  }
  img {
    height: 142px;
    margin-bottom: 2rem !important;
  }
  .blurb {
    height: 140px;
    margin-bottom: 2rem;
  }
  svg {
    height: 140px !important;
  }
  h3 {
    font-size: 30px;
    font-style: normal;
    font-weight: 400;
    line-height: 38px; /* 126.667% */
    letter-spacing: 0.3px;
  }

  p {
    margin: 0 2rem;
    color: var(--Negre, #000);
    text-align: center;
    font-family: "PP Neue Montreal";
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 21px; /* 105% */
    margin-top: 1rem;
  }
}
</style>
