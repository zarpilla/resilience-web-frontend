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
    <h6 v-if="block.type === 'heading' && block.level === 6" :class="block.css">
      <span
        v-for="(child, childIndex) in block.children"
        :key="childIndex"
        v-html="child.text"
        :class="[{ bold: child.bold }, child.css]"
      >
      </span>
    </h6>
    <ul v-if="block.type === 'list'" :class="block.css">
      <li
        v-for="(child, childIndex) in block.children"
        :key="childIndex"
        :class="[{ bold: child.bold, italic: text.italic }, child.css]"
        
      >
      <span v-for="(child2, childIndex2) in child.children" v-html="child2.text" :key="childIndex2"></span>
    </li>
    </ul>
    <p v-if="block.type === 'paragraph'" :class="block.css" class="paragraph">
      <template v-for="(child, childIndex) in block.children">
        <div
          :class="[{ bold: child.bold, italic: child.italic }, child.css]"
          v-if="child.type === 'text' && child.text.startsWith('<h4')"
          v-html="child.text"
        ></div>
        <div
          :class="[{ bold: child.bold, italic: child.italic }, child.css]"
          v-else-if="child.type === 'text' && child.text.startsWith('<h5')"
          v-html="child.text"
        ></div>
        <span
          :class="[{ bold: child.bold, italic: child.italic }, child.css]"
          v-else-if="child.type === 'text' && child.text !== '<hr>'"
          v-html="child.text.replace(/\n/g, '<br>')"
        ></span>
        <hr
          class="hr"
          v-if="child.type === 'text' && child.text === '<hr>'"          
        ></hr>
        <p
          class="new-line"
          v-if="child.type === 'text' && child.text === ''"          
        ></p>
        <template v-else-if="child.type === 'link'">
          <a :href="child.url" :class="child.css" class="link hoverable">
            <template
              v-for="(text, childIndex) in child.children"
              :key="childIndex"
            >
              <span v-html="text.text" :class="[{ bold: text.bold, italic: text.italic }, text.css]">
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
        :class="[{ bold: child.bold, italic: text.italic }, child.css]"
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
p.new-line {
  padding-bottom: 10px;
}
</style>
