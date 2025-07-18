<script setup lang="ts">
const { $gsap, $ScrollTrigger, $Observer } = useNuxtApp();

const props = defineProps<{
  section: any;
}>();

onMounted(() => {
});
const showVideo = ref(false);
const videoUrl = computed(() => {
  if (!props.section.url) return '';
  
  // Extract YouTube video ID if it's a YouTube URL
  let url = props.section.url;
  
  // Convert any direct YouTube URL to an embed URL
  if (url.includes('youtube.com/watch')) {
    // Extract the video ID from a standard YouTube URL
    const videoId = new URL(url).searchParams.get('v');
    if (videoId) {
      url = `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (url.includes('youtu.be/')) {
    // Extract the video ID from a youtu.be short URL
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      url = `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  // Ensure we're using an embed URL which avoids the X-Frame-Options issues
  if (!url.includes('/embed/') && url.includes('youtube.com')) {
    console.warn('YouTube URL should be an embed URL to avoid security issues');
  }
  
  // Add required parameters
  const separator = url.includes('?') ? '&' : '?';
  if (!window || !window.location) {
    console.warn('Window or location is not available, cannot set origin');
    return `${url}${separator}autoplay=1&enablejsapi=1`;
  }
  return `${url}${separator}autoplay=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
});

const playVideo = () => {
  showVideo.value = true;
};
</script>

<template>
  <div class="section-video">
    <div class="container position-relative">
      <!-- Show image with overlay when not playing -->
      <div
        v-if="section.image && !showVideo"
        class="media media-border-20 media-with-overlay"
      >
        <MetaMedia :media="section.image" />
      </div>
      
      <!-- Show video iframe when playing -->
      <div class="video-container" :class="{ 'd-none': !showVideo }">
        <iframe 
          width="100%" 
          height="700" 
          :src="videoUrl" 
          title="Video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen
        ></iframe>
      </div>
      
      <!-- Show play button only when not playing -->
      <div v-if="!showVideo" class="play-icon" @click="playVideo">
        <svg
          width="100"
          height="101"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            class="icon-bg"
            d="M49.6953 1.06934C76.3894 1.06946 98.0518 22.9952 98.0518 50.0693C98.0518 77.1435 76.3894 99.0692 49.6953 99.0693C23.0011 99.0693 1.33887 77.1435 1.33887 50.0693C1.33887 22.9951 23.0011 1.06934 49.6953 1.06934Z"
            fill="white"
            stroke="white"
            stroke-width="2"
          />
          <path
            d="M58.3389 48.8373C59.6722 49.6071 59.6722 51.5316 58.3389 52.3014L45.5889 59.6626C44.2555 60.4324 42.5889 59.4702 42.5889 57.9306L42.5889 43.2081C42.5889 41.6685 44.2555 40.7063 45.5889 41.4761L58.3389 48.8373Z"
            fill="black"
          />
        </svg>  
      </div>
      
      <!-- Show title only when not playing -->
      <h3 class="media-title" v-if="section.title && !showVideo">
        <span class="orange">"</span>
        {{ section.title }}
      </h3>
    </div>
  </div>
</template>

<style scoped lang="scss">
.media-with-overlay {
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.80) 100%);

    z-index: 1;
    pointer-events: none; /* Allows clicks to pass through to the media element */
    border-radius: 20px; /* If your media has border-radius, this will match it */
  }

  /* Ensure the media content stays above the overlay */
  ::v-deep(.media-content) {
    position: relative;
    z-index: 2;
  }
}

.video-container {
  // position: relative;
  // overflow: hidden;
  // width: 100%;
  border-radius: 20px;
  
  iframe {
    // position: absolute;
    // top: 0;
    // left: 0;
    // width: 100%;
    // height: 700px;
    // border-radius: 20px;
  }
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;  
  border-radius: 50%;
  cursor: pointer;

  @media screen and (max-width: 768px) {

    top: 35%;
    svg {
      width: 50px!important;
      height: 50px!important;
    }
    
  }

  &:hover {
    .icon-bg {
      fill: #f1f1f1;      
    }
  }
}

h3.media-title {
  position: absolute;
  bottom: 40px;
  left: 60px;
  color: white;
  margin: 0;
  z-index: 10;
  font-size: 24px;
  max-width: calc(50% - 30px);
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  color: var(--Blanc, #FFF)!important;
  font-family: "Queens"!important;
  font-size: 50px!important;
  font-style: normal!important;
  font-weight: 500!important;
  line-height: 120%!important;
  @media screen and (max-width: 768px) {
    bottom: 20px;
    left: 40px;
    width: calc(100% - 80px);
    font-size: 24px;
    max-width: calc(100% - 40px);
    font-size: 20px!important;
    
  }
}

.orange{
  display: block;
  color: var(--Taronja, #F5825E);
  font-family: "Queens";
  font-size: 50px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
}
</style>