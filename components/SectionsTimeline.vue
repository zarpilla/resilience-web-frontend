<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

import { computed } from "vue";

const addScriptIfNotExistsAsPromise = (
  src: string,
  id: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!document.getElementById(id)) {
      const script = document.createElement("script");
      script.src = src;
      script.id = id;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    } else {
      resolve;
    }
  });
};

const addCssIfNotExistsAsPromise = (href: string, id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.href = href;
      link.rel = "stylesheet";
      link.id = id;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    } else {
      resolve;
    }
  });
};

onMounted(() => {
  // console.log("onMounted section", props.section);
  const p1 = addScriptIfNotExistsAsPromise(
    "https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js",
    "timeline-js"
  );
  const p2 = addCssIfNotExistsAsPromise(
    "https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css",
    "timeline-css"
  );

  Promise.all([p1, p2]).then(() => {
    var tl = (window as any)["TL"];
    var timeline = new tl.Timeline(
      "re-timeline-embed-" + props.section.id,
      props.section.url,
      {
        font: "PP Neue Montreal",
      }
    );
    // console.log("timeline", timeline);
  });
});

onUnmounted(() => {});
</script>
<template>
  <div class="section-timeline" :id="`section-timeline-${section.id}`">
    <div class="container">
      <div
        :id="`re-timeline-embed-${section.id}`"
        style="width: 100%; height: 650px"
      ></div>
    </div>
  </div>
</template>
<style lang="scss"></style>
