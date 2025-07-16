import { defineStore } from 'pinia'

export const useApplicantStore = defineStore('applicant', {
  state: () => ({
    applicant: null,
  }),
  actions: {
    setApplicant(data: any) {
      this.applicant = data
    },
  },
})
