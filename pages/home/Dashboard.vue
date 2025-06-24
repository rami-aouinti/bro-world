<template>
  <Weather />
  <News />
  <Quiz />
  <Rating />
</template>

<script setup lang="ts">
import Weather from "~/pages/home/dashboard/Weather.vue";
import Rating from "~/pages/home/dashboard/Rating.vue";
import Quiz from "~/pages/home/dashboard/Quiz.vue";
import News from "~/pages/home/dashboard/News.vue";
</script>

<style scoped>
.min-h-section {
  min-height: 280px;
}
</style>
