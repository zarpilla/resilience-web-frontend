<script setup lang="ts">
import { useLocalizedNavigation } from "~/composables/useLocalizedNavigation";

const { locale, availableLocales } = useI18n();
const { getLanguageLinks } = useLocalizedNavigation();

// Props
interface Props {
  showLabels?: boolean;
  cssClass?: string;
  inline?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showLabels: true,
  cssClass: 'language-switcher',
  inline: true
});

// Get language links for current page
const languageLinks = ref<Array<{ locale: string; url: string }>>([]);

// Function to update language links
const updateLanguageLinks = async () => {
  try {
    languageLinks.value = await getLanguageLinks();
  } catch (error) {
    console.warn('Error getting language links:', error);
    // Fallback to basic locale links
    languageLinks.value = availableLocales.map(loc => ({
      locale: loc,
      url: useSwitchLocalePath()(loc)
    }));
  }
};

// Watch route changes to update language links
const route = useRoute();
watch(() => route.params.slug, () => updateLanguageLinks(), { immediate: true });
watch(() => route.name, () => updateLanguageLinks());

// Also call on mount
onMounted(() => {
  updateLanguageLinks();
});
</script>

<template>
  <ul 
    :class="[props.cssClass, { 'inline-list': props.inline, 'block-list': !props.inline }]"
  >
    <li
      v-for="(link, i) in languageLinks"
      :key="link.locale"
      :class="{ current: link.locale === locale }"
    >
      <nuxt-link :to="link.url">
        <span v-if="props.showLabels">{{ $t(link.locale) }}</span>
        <span v-else>{{ link.locale.toUpperCase() }}</span>
      </nuxt-link>
      <span v-if="props.inline && i < languageLinks.length - 1" class="separator">|</span>
    </li>
  </ul>
</template>

<style scoped>
.language-switcher {
  list-style: none;
  margin: 0;
  padding: 0;
}

.inline-list {
  display: flex;
  gap: 0.5rem;
}

.block-list li {
  display: block;
  margin-bottom: 0.5rem;
}

.separator {
  margin: 0 0.5rem;
}

.current a {
  font-weight: bold;
}
</style>
