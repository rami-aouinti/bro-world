import { defineStore } from 'pinia'

export const useCompanyStore = defineStore('company', {
  state: () => ({
    companies: [] as any[],
    loaded: false,
  }),
  actions: {
    setCompanies(newCompanies: any[]) {
      this.companies = newCompanies
      this.loaded = true
    },
  },
})
