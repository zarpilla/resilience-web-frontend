<script setup lang="ts">
import { computed, ref, nextTick, watch } from "vue";

const { locale } = useI18n();

const props = defineProps<{
  section: any;
}>();

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
      resolve(null); // Resolve immediately if script already exists
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
      resolve(null); // Resolve immediately if CSS already exists
    }
  });
};

const textStore = useTextStore();
const texts = computed(() =>
  textStore.texts.find((h) => h.locale === locale.value)
);

const timelineInstance = ref<any>(null);
const route = useRoute();

const initTimeline = async () => {
  console.log("initTimeline section", props.section);
  
  try {
    // Load scripts and CSS
    const p1 = addScriptIfNotExistsAsPromise(
      "https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js",
      "timeline-js"
    );
    const p2 = addCssIfNotExistsAsPromise(
      "https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css",
      "timeline-css"
    );

    await Promise.all([p1, p2]);
    
    // Wait for next tick to ensure DOM is ready
    await nextTick();
    
    // Add a small delay to ensure DOM is fully rendered after navigation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const timelineElement = document.getElementById("re-timeline-embed-" + props.section.id);
    
    console.log("timelineElement", timelineElement);
    console.log("TL available", !!(window as any)["TL"]);
    
    if (timelineElement && (window as any)["TL"]) {
      // Clear any existing content
      timelineElement.innerHTML = '';
      
      var tl = (window as any)["TL"];
      timelineInstance.value = new tl.Timeline(
        "re-timeline-embed-" + props.section.id,
        props.section.url,
        {
          font: "PP Neue Montreal",
        }
      );
      console.log("timeline created", timelineInstance.value);
    } else {
      console.error("Timeline element or TL library not found");
    }
  } catch (error) {
    console.error("Error initializing timeline:", error);
  }
};

onMounted(() => {
  console.log("SectionsTimeline onMounted");
  initTimeline();
});

// Watch for route changes to reinitialize timeline
watch(() => route.fullPath, () => {
  console.log("Route changed, reinitializing timeline");
  nextTick(() => {
    initTimeline();
  });
});

// Watch for props changes
watch(() => props.section, () => {
  console.log("Section props changed, reinitializing timeline");
  nextTick(() => {
    initTimeline();
  });
}, { deep: true });

onUnmounted(() => {
  console.log("SectionsTimeline onUnmounted");
  // Clean up timeline instance if it exists
  if (timelineInstance.value) {
    timelineInstance.value = null;
  }
});
</script>
<template>
  <div class="section-timeline" :id="`section-timeline-${section.id}`">
    <div class="container">
      <h3>{{ texts?.value?.data?.timelineTitle }}</h3>
      <div
        class="mt-5"
        :id="`re-timeline-embed-${section.id}`"
        style="width: 100%; height: 650px"
      ></div>
    </div>
  </div>
</template>
<style lang="scss">
.section-timeline * {
  color: #000 !important;
  text-shadow: none !important;

  .tl-slide.tl-full-image-background p,
  .tl-slide.tl-full-color-background p,
  .tl-slide.tl-full-image-background h1,
  .tl-slide.tl-full-color-background h1,
  .tl-slide.tl-full-image-background h2,
  .tl-slide.tl-full-color-background h2,
  .tl-slide.tl-full-image-background h3,
  .tl-slide.tl-full-color-background h3,
  .tl-slide.tl-full-image-background h4,
  .tl-slide.tl-full-color-background h4,
  .tl-slide.tl-full-image-background h5,
  .tl-slide.tl-full-color-background h5,
  .tl-slide.tl-full-image-background h6,
  .tl-slide.tl-full-color-background h6 {
    color: #000 !important;
    text-shadow: none !important;
  }
  .tl-slide.tl-full-image-background .tl-caption,
  .tl-slide.tl-full-color-background .tl-caption,
  .tl-slide.tl-full-image-background .tl-credit,
  .tl-slide.tl-full-color-background .tl-credit {
    color: #000 !important;
    text-shadow: none !important;
  }

  .tl-slide .tl-slide-content-container .tl-slide-content .tl-text {
    padding: 0 40px 0 40px;
  }
}
</style>
