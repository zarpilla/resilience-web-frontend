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
          <div
            v-for="(block, index) in column.text"
            :key="index"
            :style="`padding: ${column?.styles?.padding ?? '0'};
          margin: ${column?.styles?.margin ?? 'inherit'}`"
          >
            <h1
              v-if="block.type === 'heading' && block.level === 1"
              :class="block.css"
            >
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
                v-html="child.text"
                :class="[{ bold: child.bold }, child.css]"
              >
              </span>
            </h1>
            <h2
              v-if="block.type === 'heading' && block.level === 2"
              :class="block.css"
            >
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
                v-html="child.text"
                :class="[{ bold: child.bold }, child.css]"
              >
              </span>
            </h2>
            <h3
              v-if="block.type === 'heading' && block.level === 3"
              :class="block.css"
            >
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
                v-html="child.text"
                :class="[{ bold: child.bold }, child.css]"
              >
              </span>
            </h3>
            <h4
              v-if="block.type === 'heading' && block.level === 4"
              :class="block.css"
            >
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
                v-html="child.text"
                :class="[{ bold: child.bold }, child.css]"
              >
              </span>
            </h4>
            <h5
              v-if="block.type === 'heading' && block.level === 5"
              :class="block.css"
            >
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
                v-html="child.text"
                :class="[{ bold: child.bold }, child.css]"
              >
              </span>
            </h5>
            <p v-if="block.type === 'paragraph'" :class="block.css">
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
                v-html="child.text"
                :class="[{ bold: child.bold }, child.css]"
              >
              </span>
            </p>
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

</style>
