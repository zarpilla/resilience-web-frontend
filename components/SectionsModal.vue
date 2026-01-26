<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

const runtimeConfig = useRuntimeConfig();

const showModal = ref(false);

// Check if this modal has been shown before using localStorage
const modalKey = computed(() => `modal-shown-${props.section.id}`);

const shouldShowModal = () => {
  const displayFrequency = props.section.displayFrequency || 'once';
  
  // For "every_reload", always show the modal
  if (displayFrequency === 'every_reload') {
    return true;
  }
  
  const storedValue = localStorage.getItem(modalKey.value);
  
  // For "once", check if it was ever shown
  if (displayFrequency === 'once') {
    return !storedValue;
  }
  
  // For "once_per_day", check if it was shown today
  if (displayFrequency === 'once_per_day') {
    if (!storedValue) {
      return true;
    }
    
    try {
      const lastShown = new Date(storedValue);
      const today = new Date();
      
      // Check if it's a different day
      return lastShown.toDateString() !== today.toDateString();
    } catch (e) {
      // If parsing fails, show the modal
      return true;
    }
  }
  
  return false;
};

onMounted(() => {  
  if (shouldShowModal()) {
    // Show modal after a brief delay
    setTimeout(() => {
      showModal.value = true;
    }, 500);
  }
});

const closeModal = () => {
  showModal.value = false;
  
  const displayFrequency = props.section.displayFrequency || 'once';
  
  // Don't store anything for "every_reload" since it should show every time
  if (displayFrequency === 'every_reload') {
    return;
  }
  
  // For "once", store a simple flag
  if (displayFrequency === 'once') {
    localStorage.setItem(modalKey.value, 'true');
  }
  
  // For "once_per_day", store the current timestamp
  if (displayFrequency === 'once_per_day') {
    localStorage.setItem(modalKey.value, new Date().toISOString());
  }
};

const getModalSizeClass = computed(() => {
  switch (props.section.size) {
    case 'small':
      return 'modal-sm';
    case 'large':
      return 'modal-lg';
    case 'medium':
    default:
      return 'modal-md';
  }
});

// Get the appropriate image based on screen size
const getResponsiveImage = computed(() => {
  // Priority: imageMobile -> imageTablet -> image (default)
  if (props.section.imageMobile) {
    return {
      url: props.section.imageMobile.url,
      mime: props.section.imageMobile.mime,
      alt: props.section.imageMobile.alternativeText || props.section.name,
      breakpoint: 'mobile'
    };
  }
  if (props.section.imageTablet) {
    return {
      url: props.section.imageTablet.url,
      mime: props.section.imageTablet.mime,
      alt: props.section.imageTablet.alternativeText || props.section.name,
      breakpoint: 'tablet'
    };
  }
  if (props.section.image) {
    return {
      url: props.section.image.url,
      mime: props.section.image.mime,
      alt: props.section.image.alternativeText || props.section.name,
      breakpoint: 'desktop'
    };
  }
  return null;
});
</script>

<template>
  <div class="section-modal">
    <!-- Modal backdrop -->
    <div 
      v-if="showModal" 
      class="modal-backdrop fade show"
      @click="closeModal"
    ></div>

    <!-- Modal dialog -->
    <div 
      v-if="showModal" 
      class="modal fade show d-block" 
      tabindex="-1" 
      role="dialog"
      @click.self="closeModal"
    >
      <div 
        class="modal-dialog modal-dialog-centered" 
        :class="getModalSizeClass"
        role="document"
      >
        <div class="modal-content">
          <!-- Close button positioned absolutely over the image -->
          <button 
            type="button" 
            class="btn-close" 
            @click="closeModal"
            aria-label="Close"
          ></button>
          
          <div class="modal-body">
            <!-- Wrap with link if href is provided -->
            <a 
              v-if="section.href && (section.image || section.imageTablet || section.imageMobile)" 
              :href="section.href" 
              target="_blank"
              rel="noopener noreferrer"
              class="modal-link"
              @click="closeModal"
            >
              <div class="modal-media">
                <!-- Responsive image with picture element -->
                <picture v-if="section.image && section.image.mime && section.image.mime.startsWith('image')">
                  <source 
                    v-if="section.imageMobile && section.imageMobile.mime && section.imageMobile.mime.startsWith('image')"
                    :srcset="runtimeConfig.public.apiBase + section.imageMobile.url"
                    media="(max-width: 767px)"
                  />
                  <source 
                    v-if="section.imageTablet && section.imageTablet.mime && section.imageTablet.mime.startsWith('image')"
                    :srcset="runtimeConfig.public.apiBase + section.imageTablet.url"
                    media="(max-width: 1024px)"
                  />
                  <img 
                    :src="runtimeConfig.public.apiBase + section.image.url" 
                    :alt="section.image.alternativeText || section.name"
                    class="img-fluid"
                  />
                </picture>
                <!-- Responsive video -->
                <video 
                  v-else-if="section.image && section.image.mime && section.image.mime.startsWith('video')"
                  :src="runtimeConfig.public.apiBase + section.image.url"
                  controls
                  class="w-100"
                  autoplay
                  muted
                ></video>
              </div>
            </a>
            <!-- No link wrapper if href is not provided -->
            <div v-else-if="section.image || section.imageTablet || section.imageMobile" class="modal-media">
              <!-- Responsive image with picture element -->
              <picture v-if="section.image && section.image.mime && section.image.mime.startsWith('image')">
                <source 
                  v-if="section.imageMobile && section.imageMobile.mime && section.imageMobile.mime.startsWith('image')"
                  :srcset="runtimeConfig.public.apiBase + section.imageMobile.url"
                  media="(max-width: 767px)"
                />
                <source 
                  v-if="section.imageTablet && section.imageTablet.mime && section.imageTablet.mime.startsWith('image')"
                  :srcset="runtimeConfig.public.apiBase + section.imageTablet.url"
                  media="(max-width: 1024px)"
                />
                <img 
                  :src="runtimeConfig.public.apiBase + section.image.url" 
                  :alt="section.image.alternativeText || section.name"
                  class="img-fluid"
                />
              </picture>
              <!-- Responsive video -->
              <video 
                v-else-if="section.image && section.image.mime && section.image.mime.startsWith('video')"
                :src="runtimeConfig.public.apiBase + section.image.url"
                controls
                class="w-100"
                autoplay
                muted
              ></video>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-modal {
  .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 9998;
  }

  .modal {
    z-index: 9999;
  }

  .modal-dialog {
    max-width: 90vw;
    
    &.modal-sm {
      max-width: 400px;
    }
    
    &.modal-md {
      max-width: 600px;
    }
    
    &.modal-lg {
      max-width: 900px;
    }

    @media (max-width: 768px) {
      max-width: 95vw;
      margin: 1rem auto;
    }
  }

  .modal-content {
    background-color: transparent;
    border: none;
    border-radius: 8px;
    overflow: visible;
    position: relative;
  }

  .btn-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

    &:hover {
      background: rgba(255, 255, 255, 1);
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    &::before {
      content: '×';
      font-size: 2rem;
      line-height: 1;
      color: #000;
    }

    @media (max-width: 768px) {
      width: 36px;
      height: 36px;
      top: 0.5rem;
      right: 0.5rem;

      &::before {
        font-size: 1.75rem;
      }
    }
  }

  .modal-body {
    padding: 0;
  }

  .modal-link {
    display: block;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  .modal-media {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    
    img, video {
      display: block;
      width: 100%;
      height: auto;
    }
  }
}
</style>
