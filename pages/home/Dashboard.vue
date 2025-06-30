<template>
  <Weather />
  <Blogs v-if="loggedIn"/>
  <News />
  <Quiz />
  <Rating v-if="loggedIn" />
</template>

<script setup lang="ts">
import Weather from "~/pages/home/dashboard/Weather.vue";
import Rating from "~/pages/home/dashboard/Rating.vue";
import Quiz from "~/pages/home/dashboard/Quiz.vue";
import News from "~/pages/home/dashboard/News.vue";
import Blogs from "~/pages/home/dashboard/Blogs.vue";

const { loggedIn } = await useUserSession()
</script>

<style scoped>
.min-h-section {
  min-height: 280px;
}
</style>
