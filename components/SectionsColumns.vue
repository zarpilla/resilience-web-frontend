<script setup lang="ts">
const { $gsap, $ScrollTrigger, $Observer } = useNuxtApp();

const props = defineProps<{
  section: any;
}>();

const widthStyle = computed(() => ({
  width: props.section.styles?.width ? props.section.styles?.width : null,
}));

const anySectionHasVerticalScroller = computed(() => {
  return props.section.columns.some((column: any) => column.verticalScroller);
});

const runtimeConfig = useRuntimeConfig();

const hasColumnsWithFixedOnScroll = props.section.columns && props.section.columns.some((column: any) => column.styles && column.styles?.cssClass && column.styles?.cssClass.includes('fixed-when-scroll'));

const frameImage = ref<number>(140);

onMounted(() => {
  if (anySectionHasVerticalScroller.value) {
    // when the viewport enter at the middle of the section, the .vertical-scroller should be animated from -80vw to 0vw
    $gsap.set('.vertical-scroller', { x: '150vw' });
    $gsap.to('.vertical-scroller', {
      x: '0vw',
      ease: 'none',
      scrollTrigger: {
        trigger: '.has-vertical-scroller',
        start: 'top center',
        end: 'bottom center',
        //scrub: true,
      },
    });
  }

  const hasColumnsWithTextSlider = props.section.styles?.cssClass && props.section.styles?.cssClass.includes('columns-with-text-slider');   
  const columnsWithTextSlider = document.querySelectorAll( '.columns-with-text-slider');
  if (hasColumnsWithTextSlider && columnsWithTextSlider) {
    const elements = document.querySelectorAll('.columns-with-text-slider .text-slider');
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
    $gsap.to('.fixed-when-scroll > div', {
      position: 'fixed',
      ease: 'none',
      scrollTrigger: {
        trigger: '.fixed-when-scroll > div',
        start: 'top+=200px center',
        end: 'bottom-=250px center',
        endTrigger: '.fixed-when-scroll',
        scrub: true,
        pin: true,
        // markers: true,
        onUpdate: (self) => {
          // frameImgae betwween 140 and 279
          frameImage.value = Math.round(140 + (279 - 140) * self.progress);
        }
      
      },
    });
  }
});

</script>
<template>
  <div class="section-columns" :class="{ 'has-vertical-scroller': anySectionHasVerticalScroller}">

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
          margin: ${column?.styles?.margin ?? 'inherit'}`"
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
            </div>
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
  gap: 10px;
  width: 50vw;
  position: absolute;
  left: 52vw;
  margin-bottom: 120px;

  @media screen and (max-width: 768px) {
      position: relative;
      left: inherit;
      width: 100%;
  }

  > div{
    width: calc(33% - 10px);    
  }
}
.link{
  text-decoration: underline;
  color: #000;
}
</style>

<style lang="scss">
.vertical-scroller-image {
  width: 100%!important;
  border-radius: 20px;
  margin-bottom: 0!important;
}
.vertical-scroller-image-0{
  margin-top: 80px;
  height: 450px!important;
  object-fit: cover;
  @media screen and (max-width: 768px) {
    height: 250px!important;    
    margin-top: 30px;
  }
}
.vertical-scroller-image-1{
  height: 250px!important;
  @media screen and (max-width: 768px) {
    height: 150px!important;    
  }
}
.vertical-scroller-image-2{
  margin-top: 20px;  
  height: 340px!important;
  @media screen and (max-width: 768px) {
    height: 150px!important;    
  }
}
.vertical-scroller-image-3{
  margin-top: 60px;
  @media screen and (max-width: 768px) {
    height: 150px!important;    
  }
}
.vertical-scroller-image-4{
  margin-top: 20px;
  @media screen and (max-width: 768px) {
    height: 120px!important;    
  }
}
.has-vertical-scroller{
  overflow: hidden;
}
</style>
