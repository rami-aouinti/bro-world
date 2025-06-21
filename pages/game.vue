<template>
  <v-container fluid>
    <v-row align="center" justify="center" dense>
      <v-col cols="12">
        <Header class="mb-6 text-center" :title="title" />
      </v-col>
    </v-row>

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
                  loading="eager"
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
import Header from '~/components/App/AppQuiz/Header.vue';
definePageMeta({
  layout: 'default',
  description: 'Game page',
  breadcrumb: 'disabled',
})
const { data: allQuizz } = await useAsyncData("allQuizz", () =>
  queryContent("/quizz").find()
);

const title = "Dynamic quizzes generated using Wikidata and SPARQL.";

const quizzImg = (quizz) => {
  const img = quizz.image ?? "quizz-sparql.png";
  return "quizz/" + img;
};

const tags = ['quizz', 'sparql', 'wikipedia', 'wikidata'];
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
