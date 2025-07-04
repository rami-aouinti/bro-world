<template>
  <Suspense>
    <template #default>
      <Weather />
    </template>
    <template #fallback>
      <v-skeleton-loader
        type="card"
        class="rounded-xl mx-3 mb-3"
        height="140"
      />
    </template>
  </Suspense>

  <Suspense>
    <template #default>
      <Blogs v-if="loggedIn" />
    </template>
    <template #fallback>
      <v-skeleton-loader
        type="card"
        class="rounded-xl mx-3 mb-3"
        height="140"
      />
    </template>
  </Suspense>

  <Suspense>
    <template #default>
      <News />
    </template>
    <template #fallback>
      <v-skeleton-loader
        type="card"
        class="rounded-xl mx-3 mb-3"
        height="140"
      />
    </template>
  </Suspense>

  <Suspense>
    <template #default>
      <Media />
    </template>
    <template #fallback>
      <v-skeleton-loader
        type="card"
        class="rounded-xl mx-3 mb-3"
        height="140"
      />
    </template>
  </Suspense>

  <Suspense>
    <template #default>
      <Quiz />
    </template>
    <template #fallback>
      <v-skeleton-loader
        type="card"
        class="rounded-xl mx-3 mb-3"
        height="140"
      />
    </template>
  </Suspense>

  <Suspense>
    <template #default>
      <Rating />
    </template>
    <template #fallback>
      <v-skeleton-loader
        type="card"
        class="rounded-xl mx-3 mb-3"
        height="140"
      />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const { loggedIn } = await useUserSession()

const Media = defineAsyncComponent(() => import('~/pages/home/dashboard/Media.vue'))
const Weather = defineAsyncComponent(() => import('~/pages/home/dashboard/Weather.vue'))
const Blogs = defineAsyncComponent(() => import('~/pages/home/dashboard/Blogs.vue'))
const News = defineAsyncComponent(() => import('~/pages/home/dashboard/News.vue'))
const Quiz = defineAsyncComponent(() => import('~/pages/home/dashboard/Quiz.vue'))
const Rating = defineAsyncComponent(() => import('~/pages/home/dashboard/Rating.vue'))
</script>
