<script setup lang="ts">
const props = defineProps<{
  media: any;
  css?: string;
}>();

const runtimeConfig = useRuntimeConfig();
</script>
<template>
  
  <template v-if="props.media && props.media.mime.startsWith('image')">
    <img
      :src="runtimeConfig.public.apiBase + props.media.url"
      :alt="props.media.alternativeText"
      class="img"
      :class="css"
    />
  </template>  
  <template v-if="props.media && props.media.mime.startsWith('audio')">
    <audio
      controls
      :src="runtimeConfig.public.apiBase + props.media.url"
      :alt="props.media.alternativeText"
      class="audio"></audio>    
  </template>  
  <template v-if="props.media && props.media.mime.startsWith('video')">
    <div class="video-container">
    <video
      controls
      :src="runtimeConfig.public.apiBase + props.media.url"
      :alt="props.media.alternativeText"
      class="video"></video>
    </div>
  </template> 
  
</template>
<style lang="scss" scoped>
.img {
  max-width: 100%;
  //width: 100%;
}
.video-container {  
  video {
    border-radius: 20px;
    max-width: 100%;
    width: 100%;
  }  
}
.media-secondary {
    width: 100px;
  }
</style>
