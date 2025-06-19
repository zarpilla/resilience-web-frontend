import { defineStore } from "pinia";

interface Value {
  id: number;
  name: string;
}

interface Filter {
  locale: string;
  value: {
    scopes: Value[];
    typologies: Value[];
    years: Value[];
  }
}

export const useFilterStore = defineStore("filterStore", {
  state: () => ({
    filters: [] as Filter[],
  }),
  actions: {
    async fetch(locale: string) {
      try {
        // Make all 3 API calls concurrently using Promise.all
        const [scopesResponse, typologiesResponse, yearsResponse] = await Promise.all([
          useAPI("/api/scopes", { query: { locale, populate: '*' } }),
          useAPI("/api/typologies", { query: { locale, populate: '*' } }),
          useAPI("/api/years", { query: { locale, populate: '*' } })
        ]);

        // Extract and map the data
        const scopesData = (scopesResponse.data.value as any).data.map((scope: any) => ({
          id: scope.id,
          name: scope.name,
        }));

        const typologiesData = (typologiesResponse.data.value as any).data.map((typology: any) => ({
          id: typology.id,
          name: typology.name,
        }));

        const yearsData = (yearsResponse.data.value as any).data.map((year: any) => ({
          id: year.id,
          name: year.name,
        }));

        // Add to filters store
        this.filters.push({
          locale: locale,
          value: {
            scopes: scopesData.sort((a: any, b: any) => a.name.localeCompare(b.name)),
            typologies: typologiesData.sort((a: any, b: any) => a.name.localeCompare(b.name)),
            years: yearsData.sort((a: any, b: any) => a.name.localeCompare(b.name)),
          },
        });
      } catch (error) {
        console.error('Error fetching filter data:', error);
        throw error;
      }
    },
  },
  getters: {
    filter(): Filter['value'] | undefined {
      const { locale } = useI18n()
      return this.filters.find((h: Filter) => h.locale === locale.value)?.value
    },
  },
});