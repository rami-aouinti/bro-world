<script setup lang="ts">
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
  if (url) {
    const imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/;
    const imgMatch = url.match(imgRegex);
    return !!imgMatch
  }
  return false
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
const currentPostIndex = ref(0)

function goToPreviousPost() {
  if (currentPostIndex.value > 0) {
    currentPostIndex.value--
  } else {
    currentPostIndex.value = props.post?.medias?.length
  }
}
function goToNextPost() {
  if (currentPostIndex.value < props.post?.medias?.length - 1) {
    currentPostIndex.value++
  } else {
    currentPostIndex.value = 0
  }
}
import { useLocalePath } from '#i18n'
const localePath = useLocalePath()
</script>

<template>
  <div class="px-4 py-1">
    <NuxtLink :to="localePath(`/post/${props.post.slug}`)" class="text-decoration-none">
      <div v-if="props.post?.title" v-html="props.post?.title" class="text-secondary font-weight-bolder px-12 mb-4">
      </div>
    </NuxtLink>
      <div v-if="props.post?.url || props.post?.medias?.length > 0" class="text-left px-12 mb-6 text-body font-weight-light">
        <!-- Si c'est une URL YouTube, on affiche la vidéo centrée -->
        <div v-if="isYoutubeUrl(props.post?.url)" class="text-center">
          <v-sheet color="primary" rounded="xl" class="overflow-hidden shadow-lg" elevation="10">
            <iframe
              :src="`https://www.youtube.com/embed/${extractYouTubeVideoId(props.post.url)}`"
              style="width: 100%;"
              height="315"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </v-sheet>
        </div>
        <v-sheet v-else-if="isImageUrl(props.post?.url)" color="primary" rounded="xl" class="overflow-hidden shadow-lg" elevation="10">
        <NuxtImg
          :alt="`image-${props.post.slug}`"
          :src="props.post.url"
          style="width: 100%;"
          height="315"
          class="border-radius-lg shadow-lg"
          :preload="true"
          loading="eager"
          fetchpriority="high"
        />
        </v-sheet>
        <v-sheet v-else-if="props.post?.medias?.length > 0 && isImageUrl(props.post?.medias[0]?.path)" color="primary" rounded="xl" class="overflow-hidden shadow-lg" elevation="10">
          <NuxtImg
            v-if="props.post?.medias?.length > 1"
            :alt="`image-${props.post.slug}`"
            :src="props.post?.medias[currentPostIndex]?.path"
            style="width: 100%"
            height="315"
            class="border-radius-lg shadow-lg"
            :preload="true"
            loading="eager"
            fetchpriority="high"
          />
          <NuxtImg
            v-else
            :alt="`image-${props.post.slug}`"
            :src="props.post?.medias[0]?.path"
            style="width: 100%;"
            height="315"
            class="border-radius-lg shadow-lg"
            :preload="true"
            loading="eager"
            fetchpriority="high"
          />
          <v-btn
            v-if="props.post?.medias?.length > 1"
            variant="text"
            icon
            class="position-absolute left-0"
            color="primary"
            style="top: 58%; transform: translateY(-50%) translateX(25%); z-index: 10;"
            @click="goToPreviousPost"
          >
            <v-icon size="48">mdi-chevron-left</v-icon>
          </v-btn>

          <v-btn
            v-if="props.post?.medias?.length > 1"
            variant="text"
            icon
            color="primary"
            class="position-absolute right-0"
            style="top: 58%; transform: translateY(-50%) translateX(-25%); z-index: 10;"
            @click="goToNextPost"
          >
            <v-icon size="48">mdi-chevron-right</v-icon>
          </v-btn>
        </v-sheet>
        <v-sheet v-else color="primary" rounded="xl" class="overflow-hidden shadow-lg" elevation="10">
          <iframe
            :src="props.post?.medias[0]?.path"
            style="width: 100%;"
            height="315"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </v-sheet>
      </div>

    <ReactPost :post="props.post" />
  </div>

</template>
