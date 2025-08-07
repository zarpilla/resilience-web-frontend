# Multilingual Navigation Strategy

## Problem
The original implementation used `switchLocalePath` which only preserves the current route structure but doesn't handle cases where different languages have different slugs for the same content.

For example:
- English: `/scope/environmental-sustainability`
- Spanish: `/ambito/sostenibilidad-ambiental` 
- Catalan: `/ambit/sostenibilitat-ambiental`

The basic `switchLocalePath` would fail to correctly navigate between these URLs because the slugs are different.

## Solution

### 1. Composable: `useLocalizedNavigation`
Created a reusable composable (`composables/useLocalizedNavigation.ts`) that:

- Fetches page localizations from the API
- Maps locales to their corresponding slugs
- Builds correct URLs for each language variant
- Provides fallback mechanisms

### 2. Updated AppMenu Component
Modified `components/AppMenu.vue` to:

- Use the new composable for language switching
- Automatically update language links when navigating between pages
- Handle both slug-based and regular pages

### 3. Reusable Language Switcher Component
Created `components/AppLanguageSwitcher.vue` for use throughout the app:

- Configurable display options
- Automatic URL resolution
- Responsive design options

## How It Works

1. **Page Detection**: The system detects the current page type and slug from the route
2. **API Fetch**: Fetches the current page's localizations from Strapi
3. **URL Mapping**: Maps each available locale to its corresponding slug
4. **Link Generation**: Generates correct URLs using `localePath` with the proper slugs
5. **Fallback**: Falls back to basic `switchLocalePath` if localizations aren't found

## Usage

### In AppMenu (already implemented)
The language switcher in the menu automatically works with localized slugs.

### Using the Composable Directly
```typescript
const { getLocalizedUrl, navigateToLocale } = useLocalizedNavigation();

// Get URL for specific locale
const spanishUrl = await getLocalizedUrl('es');

// Navigate to specific locale
await navigateToLocale('es');
```

### Using the Language Switcher Component
```vue
<template>
  <!-- Basic usage -->
  <AppLanguageSwitcher />
  
  <!-- Customized -->
  <AppLanguageSwitcher 
    :show-labels="false" 
    :inline="false" 
    css-class="my-custom-switcher" 
  />
</template>
```

## Route Configuration Requirements

Each page type needs proper `defineI18nRoute` configuration:

```typescript
defineI18nRoute({
  paths: {
    en: "/scope/[slug]",
    es: "/ambito/[slug]",
    ca: "/ambit/[slug]",
  },
});
```

## API Requirements

Pages must be configured with localizations in Strapi, where each localized version has:
- The same `documentId` 
- Different `slug` values for each locale
- Proper `locale` field
- Connected via the `localizations` relation

## Benefits

1. **SEO Friendly**: Each language has its own optimized URL
2. **User Experience**: URLs are in the user's language
3. **Maintainable**: Centralized logic in composable
4. **Fallback Safe**: Graceful degradation if localizations aren't found
5. **Performance**: Caches localization data per page
6. **Flexible**: Can be used throughout the app

## Testing

To test the implementation:

1. Navigate to a page with different slugs per language (e.g., scope pages)
2. Use the language switcher in the menu
3. Verify the URL changes to the correct localized slug
4. Verify the content loads in the selected language
5. Test fallback behavior on pages without localizations
