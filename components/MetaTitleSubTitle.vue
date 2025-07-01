<script setup lang="ts">
const props = defineProps<{
  section: any;
  type: string;
}>();
</script>
<template>
  <h1
    v-if="section.title && section.titleHeading === 'h1'"
    v-html="section.title"
  ></h1>
  <h2
    v-if="section.title && section.titleHeading === 'h2'"
    v-html="section.title"
  ></h2>
  <h3
    v-if="section.title && section.titleHeading === 'h3'"
    v-html="section.title"
  ></h3>
  <h4
    v-if="section.title && section.titleHeading === 'h4'"
    v-html="section.title"
  ></h4>
  <h5
    v-if="section.title && section.titleHeading === 'h5'"
    v-html="section.title"
  ></h5>
  <h6
    v-if="section.title && section.titleHeading === 'h6'"
    v-html="section.title"
  ></h6>
  <p
    v-if="section.title && section.titleHeading === 'p'"
    v-html="section.title"
  ></p>
  <div v-for="(block, index) in section.text" :key="index">
    <h1 v-if="block.type === 'heading' && block.level === 1">
      <span
        v-for="(child, childIndex) in block.children"
        :key="childIndex"
        :class="[{ bold: child.bold }, child.css]"
        v-html="child.text"
      >
      </span>
    </h1>
    <h2 v-if="block.type === 'heading' && block.level === 2">
      <span
        v-for="(child, childIndex) in block.children"
        :key="childIndex"
        :class="[{ bold: child.bold }, child.css]"
        v-html="child.text"
      >
      </span>
    </h2>
    <h3 v-if="block.type === 'heading' && block.level === 3">
      <span
        v-for="(child, childIndex) in block.children"
        :key="childIndex"
        :class="[{ bold: child.bold }, child.css]"
        v-html="child.text"
      >
      </span>
    </h3>
    <h4 v-if="block.type === 'heading' && block.level === 4">
      <span
        v-for="(child, childIndex) in block.children"
        :key="childIndex"
        :class="[{ bold: child.bold }, child.css]"
        v-html="child.text"
      >
      </span>
    </h4>
    <h5 v-if="block.type === 'heading' && block.level === 5">
      <span
        v-for="(child, childIndex) in block.children"
        :key="childIndex"
        :class="[{ bold: child.bold }, child.css]"
        v-html="child.text"
      >
      </span>
    </h5>
    <p v-if="block.type === 'paragraph'">
      <span
        v-for="(child, childIndex) in block.children"
        :key="childIndex"
        :class="[{ bold: child.bold }, child.css]"
        v-html="child.text"
      >
      </span>
    </p>
  </div>
</template>
<style scoped lang="scss"></style>
