<script setup lang="ts">
import Comments from "~/pages/home/post/Comments.vue";
import ReactPost from "~/pages/home/post/ReactPost.vue";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

function isYoutubeUrl(url) {
  return /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)/.test(url)
}

function isImageUrl(url) {
  const imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/;
  const imgMatch = url.match(imgRegex);
  return !!imgMatch
}

function extractYouTubeVideoId(url) {
  try {
    const ytRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^\s&?/]+)/;
    const match = url.match(ytRegex);
    return match ? match[1] : null;
  } catch (e) {
    return null;
  }
}

import { useLocalePath } from '#i18n'
const localePath = useLocalePath()
</script>

<template>
  <div class="px-4 py-4">
    <NuxtLink :to="localePath(`/post/${props.post.slug}`)" class="text-decoration-none">
      <div class="text-left mb-6 text-body font-weight-light">
        <!-- Si c'est une URL YouTube, on affiche la vidéo centrée -->
        <div v-if="isYoutubeUrl(props.post.title)" class="text-center">
          <v-sheet color="primary" rounded="xl" class="overflow-hidden shadow-lg" elevation="10">
            <iframe
              :src="`https://www.youtube.com/embed/${extractYouTubeVideoId(props.post.title)}`"
              style="width: 100%;"
              height="365"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </v-sheet>
        </div>
        <v-sheet v-else-if="isImageUrl(props.post.title)" color="primary" rounded="xl" class="overflow-hidden shadow-lg" elevation="10">
        <NuxtImg
          :alt="`image-${props.post.slug}`"
          :src="props.post.title"
          style="width: 100%; height: auto"
          class="border-radius-lg shadow-lg"
          :preload="true"
          loading="eager"
          fetchpriority="high"
        />
        </v-sheet>
        <!-- Sinon, afficher le titre normalement -->
        <p v-else>
          {{ props.post.title }}
        </p>
      </div>
    </NuxtLink>
    <v-sheet v-if="props.post?.medias?.length > 0" color="primary" rounded="xl" class="overflow-hidden shadow-lg" elevation="10">
      <NuxtImg
        :alt="`image-${props.post.slug}`"
        :src="props.post?.medias[0]?.path"
        style="width: 100%; height: auto"
        class="border-radius-lg shadow-lg"
        :preload="true"
        loading="eager"
        fetchpriority="high"
      />
    </v-sheet>
    <ReactPost :post="props.post" />
    <Comments :post="props.post" />
  </div>

</template>
