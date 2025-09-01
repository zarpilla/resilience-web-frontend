export const useLocalizedNavigation = () => {
  const { locale, availableLocales } = useI18n();
  const switchLocalePath = useSwitchLocalePath();
  const localePath = useLocalePath();
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();

  /**
   * Get the page type from the current route name
   */
  const getCurrentPageType = (): string => {
    const routeName = route.name as string;
    const routePath = route.path;
    
    // console.log('Route name:', routeName, 'Route path:', routePath);
    
    if (!routeName || routeName === 'index') {
      return 'page';
    }
    
    // Check route path patterns for different locales
    // Scope pages: /scope/, /ambit/, /ambito/
    if (routePath.includes('/scope/') || routePath.includes('/ambit/') || routePath.includes('/ambito/')) {
      return 'scope';
    }
    
    // Article pages: /article/, /articulo/
    if (routePath.includes('/article/') || routePath.includes('/articulo/')) {
      return 'article';
    }
    
    // Service pages: /service/, /servei/, /servicio/
    if (routePath.includes('/service/') || routePath.includes('/servei/') || routePath.includes('/servicio/')) {
      return 'service';
    }
    
    // Resource pages: /resource/, /recurs/, /recurso/
    if (routePath.includes('/resource/') || routePath.includes('/recurs/') || routePath.includes('/recurso/')) {
      return 'resource';
    }
    
    // Capability pages: /capability/, /capabilitat/, /capabilidad/
    if (routePath.includes('/capability/') || routePath.includes('/capabilitat/') || routePath.includes('/capabilidad/')) {
      return 'capability';
    }
    
    // Project pages: /project/, /projecte/, /proyecto/
    if (routePath.includes('/project/') || routePath.includes('/projecte/') || routePath.includes('/proyecto/')) {
      return 'project';
    }
    
    // Bio pages: /bio/
    if (routePath.includes('/bio/')) {
      return 'bio';
    }
    
    // Fallback: try to extract from route name if it follows the pattern
    if (routeName.includes('-')) {
      const parts = routeName.split('-');
      if (parts.length > 1 && parts[parts.length - 1] === 'slug') {
        const pageType = parts.slice(0, -1).join('-');
        console.log('Extracted page type from route name:', pageType);
        return pageType;
      }
    }
    
    return 'page';
  };

  /**
   * Fetch localizations for the current page
   */
  const fetchPageLocalizations = async (slug: string, pageType: string) => {
    try {
      const apiBase = runtimeConfig.public.apiBase;
      
      const queryParams = new URLSearchParams({
        'filters[slug][$eq]': slug,
        'filters[type][$eq]': pageType,
        'status': 'published',
        'locale': locale.value,
        'populate': 'localizations'
      });
      const url = `${apiBase}/api/pages?${queryParams.toString()}`;
      const response = await $fetch(url);
        
      return (response as any)?.data?.[0];
    } catch (error) {
      console.warn('Error fetching page localizations:', error);
      return null;
    }
  };

  /**
   * Get localized URL for a specific locale and page
   */
  const getLocalizedUrl = async (targetLocale: string, currentSlug?: string, currentPageType?: string): Promise<string> => {
    const slug = currentSlug || (route.params.slug as string);
    const pageType = currentPageType || getCurrentPageType();
    
    // If no slug (home page), use basic switchLocalePath
    if (!slug) {
      return switchLocalePath(targetLocale);
    }

    // If same locale, return current path
    if (targetLocale === locale.value) {
      return route.path;
    }

    // Fetch page localizations
    const pageData = await fetchPageLocalizations(slug, pageType);

    if (pageData && pageData.localizations) {
        // Find the localization for the target locale
      const targetLocalization = pageData.localizations.find(
        (localization: any) => localization.locale === targetLocale
      );
      
      if (targetLocalization) {
        // Build the localized URL using the correct slug
        const routeData = pageType === "page" 
          ? { name: "slug", params: { slug: targetLocalization.slug } }
          : { name: `${pageType}-slug`, params: { slug: targetLocalization.slug } };
        
        return localePath(routeData, targetLocale);
      }
    }

    // Fallback to basic switchLocalePath
    return switchLocalePath(targetLocale);
  };

  /**
   * Get all language links for the current page
   */
  const getLanguageLinks = async () => {
    const currentSlug = route.params.slug as string;
    const pageType = getCurrentPageType();
    
    const links = [];
    
    for (const loc of availableLocales) {
      const url = await getLocalizedUrl(loc, currentSlug, pageType);
      links.push({
        locale: loc,
        url: url
      });
    }
    
    return links;
  };

  /**
   * Navigate to a specific locale while preserving the current page context
   */
  const navigateToLocale = async (targetLocale: string) => {
    const url = await getLocalizedUrl(targetLocale);
    return navigateTo(url);
  };

  return {
    getCurrentPageType,
    fetchPageLocalizations,
    getLocalizedUrl,
    getLanguageLinks,
    navigateToLocale
  };
};
