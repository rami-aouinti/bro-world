<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({ post: Object });
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
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
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
  <div class="d-flex align-center px-4 py-1" style="width: 100%;">
    <div v-if="props.post?.url || props.post?.medias?.length > 0" class="text-left mb-3 text-body font-weight-light" style="width: 100%;">
      <div v-if="isYoutubeUrl(props.post?.url)" class="text-center" style="width: 100%;">
        <v-card color="primary" rounded="xl" class="overflow-hidden shadow-lg text-center" elevation="10" style="width: 100%;">
          <iframe
            :src="`https://www.youtube.com/embed/${extractYouTubeVideoId(props.post.url)}`"
            height="315"
            style="width: 100%;"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </v-card>
      </div>
      <v-sheet v-else-if="isImageUrl(props.post?.url)" color="primary" rounded="xl" class="overflow-hidden shadow-lg" elevation="10">
        <NuxtImg
          format="webp" loading="lazy" cover
          :alt="`image-${props.post.slug}`"
          :src="props.post.url"
          style="width: 100%;"
          height="315"
          class="border-radius-lg shadow-lg"
          :preload="true"
          fetchpriority="high"
        />
      </v-sheet>
      <v-sheet v-else-if="props.post?.medias?.length > 0 && isImageUrl(props.post?.medias[0]?.path)" color="primary" rounded="xl" class="overflow-hidden shadow-lg" elevation="10">
        <NuxtImg
          format="webp" loading="lazy" cover
          v-if="props.post?.medias?.length > 1"
          :alt="`image-${props.post.slug}`"
          :src="props.post?.medias[currentPostIndex]?.path"
          style="width: 100%"
          height="315"
          class="border-radius-lg shadow-lg"
          :preload="true"
          fetchpriority="high"
        />
        <NuxtImg
          v-else
          format="webp" loading="lazy" cover
          :alt="`image-${props.post.slug}`"
          :src="props.post?.medias[0]?.path"
          style="width: 100%;"
          height="315"
          class="border-radius-lg shadow-lg"
          :preload="true"
          fetchpriority="high"
        />
        <v-btn
          v-if="props.post?.medias?.length > 1"
          variant="text"
          icon
          class="position-absolute left-0"
          color="lightgray"
          style="top: 50%; transform: translateY(-50%) translateX(25%); z-index: 10;"
          @click="goToPreviousPost"
        >
          <v-icon size="48">mdi-chevron-left</v-icon>
        </v-btn>

        <v-btn
          v-if="props.post?.medias?.length > 1"
          variant="text"
          icon
          color="lightgray"
          class="position-absolute right-0"
          style="top: 50%; transform: translateY(-50%) translateX(-25%); z-index: 10;"
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
  </div>
</template>
