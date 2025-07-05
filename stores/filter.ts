import { defineStore } from "pinia";

interface Value {
  id: number;
  name: string;
}

interface Filter {
  locale: string;
  type: string;
  value: {
    scopes: Value[];
    typologies: Value[];
    years: Value[];
  };
}

export const useFilterStore = defineStore("filterStore", {
  state: () => ({
    filters: [] as Filter[],
  }),
  actions: {
    async fetch(locale: string, type: string) {
      try {
        // Make all 3 API calls concurrently using Promise.all
        const [
          scopesResponse,
          typologiesResponse,
          yearsResponse,
          filtersResponse,
        ] = await Promise.all([
          useAPI("/api/scopes", { query: { locale, populate: "*" } }),
          useAPI("/api/typologies", { query: { locale, populate: "*" } }),
          useAPI("/api/years", { query: { locale, populate: "*" } }),
          useAPI("/api/pages/categories", {
            query: { locale, type, populate: "*" },
          }),
        ]);

        const availableScopes = (
          filtersResponse.data.value as any
        ).countArray.scopes.map((scope: any) => scope.id);
        const availableTypologies = (
          filtersResponse.data.value as any
        ).countArray.typologies.map((typology: any) => typology.id);
        const availableYears = (
          filtersResponse.data.value as any
        ).countArray.years.map((year: any) => year.id);

        // Extract and map the data
        const scopesData = (scopesResponse.data.value as any).data
          .map((scope: any) => ({
            id: scope.id,
            name: scope.name,
          }))
          .filter((scope: any) => availableScopes.includes(scope.id));

        const typologiesData = (typologiesResponse.data.value as any).data
          .map((typology: any) => ({
            id: typology.id,
            name: typology.name,
          }))
          .filter((typology: any) => availableTypologies.includes(typology.id));

        const yearsData = (yearsResponse.data.value as any).data
          .map((year: any) => ({
            id: year.id,
            name: year.name,
          }))
          .filter((year: any) => availableYears.includes(year.id));

        // Add to filters store
        this.filters.push({
          locale: locale,
          type: type,
          value: {
            scopes: scopesData.sort((a: any, b: any) =>
              a.name.localeCompare(b.name)
            ),
            typologies: typologiesData.sort((a: any, b: any) =>
              a.name.localeCompare(b.name)
            ),
            years: yearsData.sort((a: any, b: any) =>
              a.name.localeCompare(b.name)
            ),
          },
        });
      } catch (error) {
        console.error("Error fetching filter data:", error);
        throw error;
      }
    },
  },
  getters: {
    filterArticles(): Filter["value"] | undefined {
      const { locale } = useI18n();
      return this.filters.find(
        (h: Filter) => h.locale === locale.value && h.type === "article"
      )?.value;
    },
    filterResources(): Filter["value"] | undefined {
      const { locale } = useI18n();
      return this.filters.find(
        (h: Filter) => h.locale === locale.value && h.type === "resource"
      )?.value;
    },
  },
});
