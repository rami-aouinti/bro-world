import { defineStore } from 'pinia'
import {useCachedFetch} from "~/composables/useCachedFetch";

export const useJobStore = defineStore('job', {
  state: () => ({
    jobs:  [] as any[],
    total: 0,
    limit: 10,
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
    setLimit(limit: number) {
      this.limit = limit
    },
    setLoaded(status: boolean) {
      this.loaded = status
    },

    async fetchPublicJobs(page, limit, title?, company?, location?, query?): Promise<any[]> {
      try {
        let response: any
        response = await useCachedFetch(
          `giUbFlBbPL:public_jobs_page_${page}_limit_${limit}_${title}_${company}_${location}`,
          async () => await $fetch(`/api/job/public-jobs?${query.toString()}`),
          300
        )

        if (response?.data && Array.isArray(response.data)) {
          this.total = response.count ?? 0
          this.page = page
          this.limit = limit
          return response.data
        }

        return []
      } catch (e) {
        console.error('Failed to fetch posts', e)
        return []
      }
    },

    async fetchJobs(page, limit, title?, company?, location?, query?): Promise<any[]> {
      try {
        let response: any

        response = await useCachedFetch(
          `giUbFlBbPL:private_jobs_page_${page}_limit_${limit}_${title}_${company}_${location}`,
          async () => await $fetch(`/api/job/jobs?${query.toString()}`),
          300
        )

        if (response?.data && Array.isArray(response.data)) {
          this.total = response.count ?? 0
          this.page = page
          this.limit = limit
          return response.data
        }

        return []
      } catch (e) {
        console.error('Failed to fetch posts', e)
        return []
      }
    }
  }
})
