<script setup lang="ts">
import Comments from "~/pages/home/post/Comments.vue";
import ReactPost from "~/pages/home/post/ReactPost.vue";

defineProps({
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
</script>

<template>
  <div class="px-4 py-4">
    <NuxtLink :to="`/post/${post.slug}`" class="text-decoration-none">
      <div class="text-left mb-6 text-body font-weight-light">
        <!-- Si c'est une URL YouTube, on affiche la vidéo centrée -->
        <div v-if="isYoutubeUrl(post.title)" class="text-center">
          <iframe
            :src="`https://www.youtube.com/embed/${extractYouTubeVideoId(post.title)}`"
            style="width: 100%;"
            height="365"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
        <NuxtImg
          v-else-if="isImageUrl(post.title)"
          :alt="`image-${post.slug}`"
          :src="post.title"
          style="width: 100%; height: auto"
          class="border-radius-lg shadow-lg"
          :preload="true"
          loading="eager"
          fetchpriority="high"
        />
        <!-- Sinon, afficher le titre normalement -->
        <p v-else>
          {{ post.title }}
        </p>
      </div>
    </NuxtLink>

    <NuxtImg
      v-if="post?.medias?.length > 0"
      :alt="`image-${post.slug}`"
      :src="post?.medias[0]?.path"
      style="width: 100%; height: auto"
      class="border-radius-lg shadow-lg"
      :preload="true"
      loading="eager"
      fetchpriority="high"
    />

    <ReactPost :post="post" />
    <Comments :post="post" />
  </div>

</template>
