<script setup lang="ts">
const props = defineProps<{
  text: any;
  styles: any;
}>();

const runtimeConfig = useRuntimeConfig();
</script>
<template>
  <div
    v-for="(block, index) in text"
    :key="index"
    :style="`padding: ${styles?.padding ?? ''};
          margin: ${styles?.margin ?? ''}`"
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
      <template v-for="(child, childIndex) in block.children">
        <span
          :class="[{ bold: child.bold }, child.css]"
          v-if="child.type === 'text'"
          v-html="child.text.replace(/\n/g, '<br>')"
        ></span>
        <template v-else-if="child.type === 'link'">
          <a :href="child.url" :class="child.css" class="link hoverable">
            <template
              v-for="(text, childIndex) in child.children"
              :key="childIndex"
            >
              <span v-html="text.text" :class="[{ bold: text.bold }, text.css]">
              </span>
            </template>
          </a>
        </template>
      </template>
    </p>
    <a v-if="block.type === 'link'" :href="block.url" :class="block.css">
      <span
        v-for="(child, childIndex) in block.children"
        :key="childIndex"
        v-html="child.text"
        :class="[{ bold: child.bold }, child.css]"
      >
      </span>
    </a>
  </div>
</template>
<style lang="scss" scoped>
.link{
  text-decoration: underline;
  color: #000;
}
</style>
