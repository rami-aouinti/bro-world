<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <v-list class="bg-transparent" role="list">
          <v-list-item
            v-for="(user, index) in topUsers"
            :key="user.name"
            variant="text"
            class="px-4"
            role="listitem"
            aria-label="Quiz ranking item"
          >
            <template #prepend>
              <v-avatar size="36">
        <span class="text-h6">
          {{ trophies[index] || '🏅' }}
        </span>
              </v-avatar>
            </template>

            <template #default>
              <div class="d-flex align-center w-100">
                <span class="font-weight-medium">{{ user.name }}</span>
                <span class="text-body-2 font-weight-bold ms-auto">
          {{ user.points }} pts
        </span>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </teleport>
    </client-only>
    <div class="my-4 text-center">
      <v-btn
        v-for="(tag, id) in tags"
        :key="id"
        small
        :ripple="false"
        height="21"
        variant="text"
        class="px-3 text-primary"
      >
        {{ tag }}
      </v-btn>
    </div>

    <v-row align="stretch" justify="center" dense>
      <v-col
        v-for="(quizz, id) in allQuizz"
        :key="id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="quiz-card" rounded="xl" variant="text" bordered>
          <div class="card-header">
            <h6 class="text-h6 text-typo">
              {{ truncate(quizz.title, 20) }}
            </h6>
          </div>

          <v-card-text class="p-0">
            <NuxtLink :to="`/quizz/${quizz.name}`">
              <div class="card-image-wrapper">
                <v-avatar
                  v-if="quizz.icon"
                  class="card-icon"
                  size="32"
                >
                  <v-icon dynamic :name="quizz.icon" />
                </v-avatar>
                <NuxtImg
                  :src="quizzImg(quizz)"
                  :alt="quizz.title"
                  width="400"
                  height="200"
                  class="card-image"
                  :preload="true"
                  format="webp"
                  loading="lazy"
                  cover
                  fetchpriority="high"
                />
              </div>
            </NuxtLink>
          </v-card-text>

          <v-card-actions class="px-4 pb-4">
            <v-btn
              v-for="(badge, i) in quizz.badges?.split(',')"
              :key="i"
              :ripple="false"
              height="21"
              variant="text"
              color="primary"
              class="mr-2"
            >
              {{ badge }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { truncate } from '~/utils/stringUtils';
import { onMounted, ref, nextTick } from 'vue'
definePageMeta({
  layout: 'default',
  description: 'Game page',
  title: 'Quizzes',
  meta: [
    { name: 'description', content: 'Explore dynamic quizzes generated using Wikidata and SPARQL.' },
    { name: 'keywords', content: 'quizzes, sparql, wikidata, wikipedia' },
  ],
  head: {
    title: 'Quizzes',
    meta: [
      { name: 'description', content: 'Explore dynamic quizzes generated using Wikidata and SPARQL.' },
      { name: 'keywords', content: 'quizzes, sparql, wikidata, wikipedia' },
    ],
  },
  breadcrumb: 'disabled',
  scrollToTop: true,
})
const { data: allQuizz } = await useAsyncData("allQuizz", () =>
  queryContent("/quizz").find()
);
const canTeleport = ref(false)
const title = "Dynamic quizzes generated using Wikidata and SPARQL.";

const quizzImg = (quizz) => {
  const img = quizz.image ?? "quizz-sparql.png";
  return "quizz/" + img;
};

const tags = ['quizz', 'sparql', 'wikipedia', 'wikidata'];

const topUsers = ref<{ name: string; points: number }[]>([])
const trophies = ['🥇', '🥈', '🥉']
const loadingQuiz = ref(true)

const fetchQuiz = async () => {
  try {
    // API call simulation or real fetch
    topUsers.value = [
      { name: 'Alice', points: 1200 },
      { name: 'Bob', points: 980 },
      { name: 'Charlie', points: 870 }
    ]
  } catch (error) {
    console.error('Failed to fetch quiz rankings:', error)
  } finally {
    loadingQuiz.value = false
  }
}

onMounted(async () => {
  window.scrollTo({ top: 0 })
  await fetchQuiz()
  await nextTick()
  setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
})
</script>

<style scoped>
.quiz-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.card-header {
  padding: 16px 16px 0;
}

.card-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 8px;
}

.card-icon {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: rgba(30, 41, 59, 0.8);
  z-index: 2;
}
</style>
