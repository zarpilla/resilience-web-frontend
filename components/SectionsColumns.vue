<script setup lang="ts">
const { $gsap, $ScrollTrigger, $Observer } = useNuxtApp();

const props = defineProps<{
  section: any;
  audio?: any;
}>();

const widthStyle = computed(() => ({
  width: props.section.styles?.width ? props.section.styles?.width : null,
}));

const anySectionHasVerticalScroller = computed(() => {
  return props.section.columns.some((column: any) => column.verticalScroller);
});

const runtimeConfig = useRuntimeConfig();

const hasColumnsWithFixedOnScroll =
  props.section.columns &&
  props.section.columns.some(
    (column: any) =>
      column.styles &&
      column.styles?.cssClass &&
      column.styles?.cssClass.includes("fixed-when-scroll")
  );

const frameImage = ref<number>(140);

const createParallaxEffect = () => {
  // Target the parent container of all vertical scroller images
  const verticalScrollerContainers =
    document.querySelectorAll(".vertical-scroller");

  if (!verticalScrollerContainers.length) return;

  verticalScrollerContainers.forEach((container) => {
    // Using fromTo instead of to to ensure proper reversal
    $gsap.fromTo(
      container,
      { y: 80 }, // Starting position
      {
        y: -80, // End position when scrolled down
        ease: "none",
        scrollTrigger: {
          trigger: ".has-vertical-scroller",
          start: "top bottom", // When the top of the trigger hits the bottom of the viewport
          end: "bottom top", // When the bottom of the trigger hits the top of the viewport
          scrub: true, // Smooth scrubbing, takes 1 second to "catch up" to the scrollbar
          // markers: true,    // Uncomment for debugging
          invalidateOnRefresh: true, // Recalculate on window resize
        },
      }
    );
  });
};

onMounted(() => {
  if (anySectionHasVerticalScroller.value) {
    // with gsap, I'd like a litte parallax effect on the vertical scroller images

    createParallaxEffect();

    const seconds = 10;
    // When vertical scroller has more than 5 images (allImages), randomize the src of the images (images) with the src of all the images (allImages)
    const verticalScrollerImages = document.querySelectorAll(
      ".vertical-scroller-image"
    );
    const allHiddenImages = document.querySelectorAll(
      ".vertical-scroller-image-hidden"
    );

    if (allHiddenImages.length > 5) {
      // Create an array of all image sources from hidden images
      const allImageSources = Array.from(allHiddenImages).map((img) =>
        img.getAttribute("src")
      );

      // Set up interval to randomize images
      setInterval(() => {
        // Shuffle the array of image sources
        const shuffledSources = [...allImageSources].sort(
          () => Math.random() - 0.5
        );
        // Update each visible image with a random source
        verticalScrollerImages.forEach((imageWrapper, index) => {
          if (index < 5) {
            const img = imageWrapper;
            const originalSrc = img.getAttribute("src") || "";
            const originalSrcSet = img.getAttribute("srcset");
            const newSrc = shuffledSources[index] || originalSrc;
            if (img) {
              // Animate the change with a fade effect
              $gsap.to(img, {
                opacity: 0,
                duration: 0.5,
                // random delaybetween 0 and 2 seconds
                delay: Math.random() * 10,
                onComplete: () => {
                  /* ts-ignore */
                  img.setAttribute("src", newSrc);
                  img.setAttribute(
                    "srcset",
                    originalSrcSet?.replace(originalSrc, newSrc) ?? ""
                  );
                  /* ts-ignore */
                  $gsap.to(img, {
                    opacity: 1,
                    duration: 0.5,
                  });
                },
              });
            }
          }
        });
      }, seconds * 1000);
    }
  }

  const hasColumnsWithTextSlider =
    props.section.styles?.cssClass &&
    props.section.styles?.cssClass.includes("columns-with-text-slider");
  const columnsWithTextSlider = document.querySelectorAll(
    ".columns-with-text-slider"
  );
  if (hasColumnsWithTextSlider && columnsWithTextSlider) {
    const elements = document.querySelectorAll(
      ".columns-with-text-slider .text-slider"
    );
    const tl = $gsap.timeline({ repeat: -1 });
    elements.forEach((element, index) => {
      $gsap.set(element, { opacity: 0 });
    });
    elements.forEach((element, index) => {
      const nextElement = elements[index + 1] || elements[0];
      tl.to(element, { opacity: 1, duration: 0 })
        .to(element, { opacity: 0, duration: 1 }, "+=3")
        .to(nextElement, { opacity: 1, duration: 1 }, "-=1");
    });
  }

  if (hasColumnsWithFixedOnScroll) {
    $gsap.to(".fixed-when-scroll > div", {
      position: "fixed",
      ease: "none",
      scrollTrigger: {
        trigger: ".fixed-when-scroll > div",
        start: "top+=200px center",
        end: "bottom-=250px center",
        endTrigger: ".fixed-when-scroll",
        scrub: true,
        pin: true,
        // markers: true,
        onUpdate: (self) => {
          // frameImgae betwween 140 and 279
          frameImage.value = Math.round(140 + (279 - 140) * self.progress);
        },
      },
    });
  }
});
</script>
<template>
  <div
    class="section-columns"
    :class="{ 'has-vertical-scroller': anySectionHasVerticalScroller }"
  >
    <div class="container">
      <div
        v-if="section.columns && section.columns.length"
        class="row"
        :style="widthStyle"
      >
        <div
          v-for="(column, columnIndex) in section.columns"
          :key="columnIndex"
          class="col-12 col-md"
          :class="column.styles?.cssClass ?? 'col-12 col-md'"
          :style="{
            backgroundImage: column.styles?.backgroundImage
              ? `url(${
                  runtimeConfig.public.apiBase +
                  column.styles.backgroundImage.url
                })`
              : 'none',
          }"
        >
          <MetaListen
            v-if="column.listenAudioBefore"
            :audio="audio"
          ></MetaListen>

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

          <MetaText :text="column.text" :styles="column.styles" />

          <div v-if="hasColumnsWithFixedOnScroll && columnIndex === 0">
            <img :src="`/images/frames/frame_${frameImage}.png`" alt="" />
          </div>

          <div v-if="column.media" class="media">
            <MetaMedia :media="column.media" />
          </div>

          <div
            v-if="column.c2a"
            :style="`padding: ${column?.styles?.padding ?? '0'};
          ${column?.styles?.margin ? 'margin:' + column?.styles?.margin : ''}`"
          >
            <MetaC2A :c2a="column.c2a" :section="section" />
          </div>
          <div
            v-if="column.verticalScroller"
            class="vertical-scroller d-flex flex-wrap"
          >
            <div class="column-0">
              <MetaMedia
                v-if="column.verticalScroller.children.length > 0"
                :css="`vertical-scroller-image vertical-scroller-image-0 media-border-radius`"
                :media="column.verticalScroller.children[0].image"
              />
            </div>
            <div class="column-1">
              <MetaMedia
                v-if="column.verticalScroller.children.length > 1"
                :css="`vertical-scroller-image vertical-scroller-image-1 media-border-radius`"
                :media="column.verticalScroller.children[1].image"
              />
              <MetaMedia
                v-if="column.verticalScroller.children.length > 2"
                :css="`vertical-scroller-image vertical-scroller-image-2 media-border-radius`"
                :media="column.verticalScroller.children[2].image"
              />
            </div>
            <div class="column-2">
              <MetaMedia
                v-if="column.verticalScroller.children.length > 3"
                :css="`vertical-scroller-image vertical-scroller-image-3 media-border-radius`"
                :media="column.verticalScroller.children[3].image"
              />
              <MetaMedia
                v-if="column.verticalScroller.children.length > 4"
                :css="`vertical-scroller-image vertical-scroller-image-4 media-border-radius`"
                :media="column.verticalScroller.children[4].image"
              />

              <MetaMedia
                v-for="image in column.verticalScroller.children"
                :key="image.id"
                :css="`vertical-scroller-image-hidden d-none`"
                :media="image.image"
              />
            </div>
          </div>

          <div v-if="column.listenAudioAfter" class="mt-5">
            <MetaListen :audio="audio"></MetaListen>
          </div>
        </div>
      </div>

      <!-- <pre>{{ section }}</pre> -->
    </div>
  </div>
</template>
<style scoped lang="scss">
.section-hero {
  background-size: cover;
}
.bold {
  font-weight: bold;
}
.vertical-scroller {
  gap: 20px;
  width: 780px;
  position: absolute;
  left: 50%;
  margin-bottom: 120px;

  @media screen and (max-width: 768px) {
    position: relative;
    left: inherit;
    width: 100%;
  }

  > div {
    width: 240px;
    @media screen and (max-width: 1550px) {
      width: calc(33.33% - 20px);
    }
  }
}
.link {
  text-decoration: underline;
  color: #000;
}
</style>

<style lang="scss">
.vertical-scroller-image {
  width: 240px !important;
  height: 260px !important;
  border-radius: 20px;
  margin-bottom: 0 !important;
  object-fit: cover;
}
.vertical-scroller-image-0 {
  margin-top: 120px;
}
.vertical-scroller-image-2 {
  margin-top: 20px;
}

.vertical-scroller-image-3 {
  margin-top: 60px;
}
.vertical-scroller-image-4 {
  margin-top: 20px;
}
.has-vertical-scroller {
  overflow: hidden;
}
</style>
