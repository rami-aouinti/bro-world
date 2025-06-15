import { defineStore } from 'pinia'

export const useJobStore = defineStore('job', {
  state: () => ({
    jobs: [] as any[],
    loaded: false,
  }),
  actions: {
    setJobs(newJobs: any[]) {
      this.jobs = newJobs
      this.loaded = true
    },
  },
})
