<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

const widthStyle = computed(() => ({
  width: props.section.styles?.width ? props.section.styles?.width : null,
}));

const runtimeConfig = useRuntimeConfig();
</script>
<template>
  <div class="section-columns">
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
            backgroundImage: column.styles?.backgroundImage ? `url(${runtimeConfig.public.apiBase + column.styles.backgroundImage.url})` : 'none',            
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
            <h1 v-if="block.type === 'heading' && block.level === 1" :class="block.css">
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
                v-html="child.text"
                :class="[{ bold: child.bold }, child.css]"
              >
              </span>
            </h1>
            <h2 v-if="block.type === 'heading' && block.level === 2" :class="block.css">
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
                v-html="child.text"
                :class="[{ bold: child.bold }, child.css]"
              >
              </span>
            </h2>
            <h3 v-if="block.type === 'heading' && block.level === 3" :class="block.css">
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
                v-html="child.text"
                :class="[{ bold: child.bold }, child.css]"
              >
              </span>
            </h3>
            <h4 v-if="block.type === 'heading' && block.level === 4" :class="block.css">
              <span
                v-for="(child, childIndex) in block.children"
                :key="childIndex"
                v-html="child.text"
                :class="[{ bold: child.bold }, child.css]"
              >
              </span>
            </h4>
            <h5 v-if="block.type === 'heading' && block.level === 5" :class="block.css">
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
.bold{
  font-weight: bold;
}
// .container{
//   height: 100%;
//   text-align: left;
//   align-items: flex-end;
//   display: flex;
// }
</style>

