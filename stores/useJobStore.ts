import { defineStore } from 'pinia'

export const useJobStore = defineStore('job', {
  state: () => ({
    jobs: [],
    total: 0,
    page: 0,
    loaded: false
  }),
  actions: {
    setJobs(jobs: any[]) {
      this.jobs = jobs
    },
    setTotal(total: number) {
      this.total = total
    },
    setPage(page: number) {
      this.page = page
    },
    setLoaded(status: boolean) {
      this.loaded = status
    }
  }
})
