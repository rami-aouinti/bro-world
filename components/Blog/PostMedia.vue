<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({ post: Object });
const currentIndex = ref(0);

const isYoutube = (url: string) => /youtube\.com|youtu\.be/.test(url);
const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
const extractYT = (url: string) => url?.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1] || null;

const next = () => (currentIndex.value = (currentIndex.value + 1) % props.post.medias.length);
const prev = () => (currentIndex.value = (currentIndex.value - 1 + props.post.medias.length) % props.post.medias.length);
</script>

<template>
  <div class="d-flex align-center px-4 py-1">
    <div v-if="props.post.url || props.post.medias?.length" class="mb-3">
      <!-- YouTube -->
      <iframe v-if="isYoutube(props.post.url)"
              class="w-100 rounded-xl" height="315"
              :src="`https://www.youtube.com/embed/${extractYT(props.post.url)}`" frameborder="0" allowfullscreen />

      <!-- Image principale -->
      <NuxtImg v-else-if="isImage(props.post.url)"
               class="w-100 rounded-xl shadow-lg" :src="props.post.url" loading="lazy" format="webp" />

      <!-- Galerie -->
      <div v-else-if="props.post.medias?.length">
        <NuxtImg class="w-100 rounded-xl shadow-lg"
                 :src="props.post.medias[currentIndex]?.path" loading="lazy" format="webp" />

        <v-btn v-if="props.post.medias.length > 1" icon @click="prev" class="position-absolute left-0">‹</v-btn>
        <v-btn v-if="props.post.medias.length > 1" icon @click="next" class="position-absolute right-0">›</v-btn>
      </div>
    </div>
  </div>
</template>
