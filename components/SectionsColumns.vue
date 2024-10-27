<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

import { computed } from "vue";

const runtimeConfig = useRuntimeConfig();
</script>
<template>
  <div class="section-blurbs">
    <div class="container">
      <div v-if="section.columns && section.columns.length" class="row">
        <div
          v-for="(column, columnIndex) in section.columns"
          :key="columnIndex"
          class="col"
          :class="column.styles?.cssClass ?? 'col'"
        >
          <h1 v-if="column.title && column.titleHeading === 'h1'">
            {{ column.title }}
          </h1>
          <h2 v-if="column.title && column.titleHeading === 'h2'">
            {{ column.title }}
          </h2>
          <h3 v-if="column.title && column.titleHeading === 'h3'">
            {{ column.title }}
          </h3>
          <h4 v-if="column.title && column.titleHeading === 'h4'">
            {{ column.title }}
          </h4>
          <h5 v-if="column.title && column.titleHeading === 'h5'">
            {{ column.title }}
          </h5>
          <p v-if="column.title && column.titleHeading === 'p'">
            {{ column.title }}
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
.section-hero {
  background-size: cover;
}
</style>
