<script setup lang="ts">
const { locale } = useI18n();
const props = defineProps<{
  audio: any;
  css?: string;
}>();

const textStore = useTextStore();
const texts = computed(() =>
  textStore.texts.find((h) => h.locale === locale.value)
);

const runtimeConfig = useRuntimeConfig();

const isPlaying = ref(false);
const isLoading = ref(false);
const hasError = ref(false);
const audioRef = ref<HTMLAudioElement | null>(null);

const togglePlay = async () => {
  if (!props.audio) return;

  if (isPlaying.value) {
    // Pause the audio
    audioRef.value?.pause();
    isPlaying.value = false;
  } else {
    try {
      isLoading.value = true;
      hasError.value = false;

      // Stop any currently playing audio
      if (audioRef.value) {
        audioRef.value.pause();
        audioRef.value = null;
      }

      // Create new audio instance
      audioRef.value = new Audio(
        runtimeConfig.public.apiBase + props.audio.url
      );

      // Add event listeners
      audioRef.value.addEventListener("loadstart", () => {
        isLoading.value = true;
      });

      audioRef.value.addEventListener("canplay", () => {
        isLoading.value = false;
      });

      audioRef.value.addEventListener("ended", () => {
        isPlaying.value = false;
        isLoading.value = false;
      });

      audioRef.value.addEventListener("error", () => {
        hasError.value = true;
        isLoading.value = false;
        isPlaying.value = false;
      });

      // Start playing
      await audioRef.value.play();
      isPlaying.value = true;
      isLoading.value = false;
    } catch (error) {
      console.error("Error playing audio:", error);
      hasError.value = true;
      isLoading.value = false;
      isPlaying.value = false;
    }
  }
};

// Clean up audio when component unmounts
onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause();
    audioRef.value = null;
  }
});
</script>
<template>
  <div
    v-if="props.audio && props.audio.mime.startsWith('audio')"
    class="meta-listen"
    :class="props.css || ''"
  >
    <!-- Loading spinner -->
    <svg
      v-if="isLoading"
      class="audio-control loading"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="#1C1B1F"
        stroke-width="2"
        stroke-linecap="round"
        stroke-dasharray="31.416"
        stroke-dashoffset="31.416"
      >
        <animate
          attributeName="stroke-dasharray"
          dur="2s"
          values="0 31.416;15.708 15.708;0 31.416;0 31.416"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dashoffset"
          dur="2s"
          values="0;-15.708;-31.416;-31.416"
          repeatCount="indefinite"
        />
      </circle>
    </svg>

    <!-- Error icon -->
    <svg
      v-else-if="hasError"
      class="audio-control error"
      @click="togglePlay"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        fill="#ff6b6b"
      />
    </svg>

    <!-- Play button when not playing -->

    <svg
      v-else-if="!isPlaying"
      class="audio-control hoverable"
      width="9"
      height="12"
      viewBox="0 0 9 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      @click="togglePlay"
      :title="props.audio.alternativeText || 'Play audio'"
    >
      <path
        d="M8.28227 5.9844L2.14213 1.81514C2.09041 1.78002 2.03121 1.76085 1.97061 1.75959C1.91001 1.75833 1.8502 1.77503 1.79734 1.80797C1.74447 1.84091 1.70046 1.8889 1.66983 1.94701C1.63919 2.00512 1.62305 2.07125 1.62305 2.13859V10.4771C1.62305 10.5445 1.63919 10.6106 1.66983 10.6687C1.70046 10.7268 1.74447 10.7748 1.79734 10.8078C1.8502 10.8407 1.91001 10.8574 1.97061 10.8561C2.03121 10.8549 2.09041 10.8357 2.14213 10.8006L8.28227 6.63131C8.33218 6.59745 8.37335 6.54992 8.40194 6.49328C8.43054 6.43665 8.44555 6.3728 8.44555 6.30786C8.44555 6.24292 8.43054 6.17907 8.40194 6.12243C8.37335 6.0658 8.33218 6.01827 8.28227 5.9844Z"
        :fill="props.css || '#1C1B1F'"
      />
      <path
        d="M8.28227 5.9844L2.14213 1.81514C2.09041 1.78002 2.03121 1.76085 1.97061 1.75959C1.91001 1.75833 1.8502 1.77503 1.79734 1.80797C1.74447 1.84091 1.70046 1.8889 1.66983 1.94701C1.63919 2.00512 1.62305 2.07125 1.62305 2.13859V10.4771C1.62305 10.5445 1.63919 10.6106 1.66983 10.6687C1.70046 10.7268 1.74447 10.7748 1.79734 10.8078C1.8502 10.8407 1.91001 10.8574 1.97061 10.8561C2.03121 10.8549 2.09041 10.8357 2.14213 10.8006L8.28227 6.63131C8.33218 6.59745 8.37335 6.54992 8.40194 6.49328C8.43054 6.43665 8.44555 6.3728 8.44555 6.30786C8.44555 6.24292 8.43054 6.17907 8.40194 6.12243C8.37335 6.0658 8.33218 6.01827 8.28227 5.9844Z"
        :fill="props.css || '#1C1B1F'"
        fill-opacity="0.2"
      />
      <path
        d="M8.28227 5.9844L2.14213 1.81514C2.09041 1.78002 2.03121 1.76085 1.97061 1.75959C1.91001 1.75833 1.8502 1.77503 1.79734 1.80797C1.74447 1.84091 1.70046 1.8889 1.66983 1.94701C1.63919 2.00512 1.62305 2.07125 1.62305 2.13859V10.4771C1.62305 10.5445 1.63919 10.6106 1.66983 10.6687C1.70046 10.7268 1.74447 10.7748 1.79734 10.8078C1.8502 10.8407 1.91001 10.8574 1.97061 10.8561C2.03121 10.8549 2.09041 10.8357 2.14213 10.8006L8.28227 6.63131C8.33218 6.59745 8.37335 6.54992 8.40194 6.49328C8.43054 6.43665 8.44555 6.3728 8.44555 6.30786C8.44555 6.24292 8.43054 6.17907 8.40194 6.12243C8.37335 6.0658 8.33218 6.01827 8.28227 5.9844Z"
        :fill="props.css || '#1C1B1F'"
        fill-opacity="0.2"
      />
      <path
        d="M8.28227 5.9844L2.14213 1.81514C2.09041 1.78002 2.03121 1.76085 1.97061 1.75959C1.91001 1.75833 1.8502 1.77503 1.79734 1.80797C1.74447 1.84091 1.70046 1.8889 1.66983 1.94701C1.63919 2.00512 1.62305 2.07125 1.62305 2.13859V10.4771C1.62305 10.5445 1.63919 10.6106 1.66983 10.6687C1.70046 10.7268 1.74447 10.7748 1.79734 10.8078C1.8502 10.8407 1.91001 10.8574 1.97061 10.8561C2.03121 10.8549 2.09041 10.8357 2.14213 10.8006L8.28227 6.63131C8.33218 6.59745 8.37335 6.54992 8.40194 6.49328C8.43054 6.43665 8.44555 6.3728 8.44555 6.30786C8.44555 6.24292 8.43054 6.17907 8.40194 6.12243C8.37335 6.0658 8.33218 6.01827 8.28227 5.9844Z"
        :fill="props.css || '#1C1B1F'"
        fill-opacity="0.2"
      />
      <path
        d="M8.28227 5.9844L2.14213 1.81514C2.09041 1.78002 2.03121 1.76085 1.97061 1.75959C1.91001 1.75833 1.8502 1.77503 1.79734 1.80797C1.74447 1.84091 1.70046 1.8889 1.66983 1.94701C1.63919 2.00512 1.62305 2.07125 1.62305 2.13859V10.4771C1.62305 10.5445 1.63919 10.6106 1.66983 10.6687C1.70046 10.7268 1.74447 10.7748 1.79734 10.8078C1.8502 10.8407 1.91001 10.8574 1.97061 10.8561C2.03121 10.8549 2.09041 10.8357 2.14213 10.8006L8.28227 6.63131C8.33218 6.59745 8.37335 6.54992 8.40194 6.49328C8.43054 6.43665 8.44555 6.3728 8.44555 6.30786C8.44555 6.24292 8.43054 6.17907 8.40194 6.12243C8.37335 6.0658 8.33218 6.01827 8.28227 5.9844Z"
        :fill="props.css || '#1C1B1F'"
        fill-opacity="0.2"
      />
      <path
        d="M8.28227 5.9844L2.14213 1.81514C2.09041 1.78002 2.03121 1.76085 1.97061 1.75959C1.91001 1.75833 1.8502 1.77503 1.79734 1.80797C1.74447 1.84091 1.70046 1.8889 1.66983 1.94701C1.63919 2.00512 1.62305 2.07125 1.62305 2.13859V10.4771C1.62305 10.5445 1.63919 10.6106 1.66983 10.6687C1.70046 10.7268 1.74447 10.7748 1.79734 10.8078C1.8502 10.8407 1.91001 10.8574 1.97061 10.8561C2.03121 10.8549 2.09041 10.8357 2.14213 10.8006L8.28227 6.63131C8.33218 6.59745 8.37335 6.54992 8.40194 6.49328C8.43054 6.43665 8.44555 6.3728 8.44555 6.30786C8.44555 6.24292 8.43054 6.17907 8.40194 6.12243C8.37335 6.0658 8.33218 6.01827 8.28227 5.9844Z"
        :fill="props.css || '#1C1B1F'"
        fill-opacity="0.2"
      />
      <path
        d="M8.28227 5.9844L2.14213 1.81514C2.09041 1.78002 2.03121 1.76085 1.97061 1.75959C1.91001 1.75833 1.8502 1.77503 1.79734 1.80797C1.74447 1.84091 1.70046 1.8889 1.66983 1.94701C1.63919 2.00512 1.62305 2.07125 1.62305 2.13859V10.4771C1.62305 10.5445 1.63919 10.6106 1.66983 10.6687C1.70046 10.7268 1.74447 10.7748 1.79734 10.8078C1.8502 10.8407 1.91001 10.8574 1.97061 10.8561C2.03121 10.8549 2.09041 10.8357 2.14213 10.8006L8.28227 6.63131C8.33218 6.59745 8.37335 6.54992 8.40194 6.49328C8.43054 6.43665 8.44555 6.3728 8.44555 6.30786C8.44555 6.24292 8.43054 6.17907 8.40194 6.12243C8.37335 6.0658 8.33218 6.01827 8.28227 5.9844Z"
        :fill="props.css || '#1C1B1F'"
        fill-opacity="0.2"
      />
    </svg>

    <!-- Pause button when playing -->
     
    <svg
      v-else
      class="audio-control hoverable playing"
      @click="togglePlay"
      width="6"
      height="14"
      viewBox="0 0 6 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      title="Pause audio"
    >
    <path d="M0.0634766 8.89795H2.06348V0.897949H0.0634766V8.89795ZM4.06348 8.89795H6.06348V0.897949H4.06348V8.89795Z" :fill="props.css || '#1C1B1F'"/>
    </svg>

    <span class="audio-label">{{
      texts?.value?.data?.listen || "Sending..."
    }}</span>
    <!-- Hidden audio element for accessibility -->
    <audio
      v-show="false"
      controls
      :src="runtimeConfig.public.apiBase + props.audio.url"
      :alt="props.audio.alternativeText"
      ref="fallbackAudio"
    ></audio>
  </div>
</template>
<style lang="scss" scoped>
.meta-listen {
  display: inline-flex;
  align-items: center;
}

.audio-control {
  cursor: pointer;
  transition: all 0.2s ease;

  border: 2px solid #000;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  padding: 6px;

  &:hover:not(.loading) {
    //opacity: 0.7;
    transform: scale(1.1);
  }

  &:active:not(.loading) {
    transform: scale(0.95);
  }

  &.loading {
    cursor: wait;
    opacity: 0.6;
  }

  &.error {
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  &.playing {
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
}

// Hidden fallback audio for accessibility
audio {
  display: none !important;
}

// Animation for the loading spinner
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading circle {
  transform-origin: center;
}

.audio-label {
  color: var(--negre, #000);
  font-family: "PP Neue Montreal";
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 23.4px */
  letter-spacing: 0.18px;
  padding-left: 10px;
}
.meta-listen {
  margin-bottom: 30px;
}

.white {
  .audio-control {
    border-color: #fff;
    background-color: #000;

    &.loading {
      border-color: #fff;
      background-color: #000;
    }

    &.error {
      fill: #ff6b6b;
    }

    &.playing {
      fill: #fff;
    }
  }

  .audio-label {
    color: #fff;
  }
}
</style>
