<template>
  <v-container fluid>
    <v-row align="center" justify="center" dense>
      <v-col cols="12" md="12">
        <Header class="mb-6 text-center" :title="title"/>
      </v-col>
    </v-row>
    <div class="my-4 text-center mb-4">
      <v-btn
        v-for="(tag, id) in tags"
        :key="id"
        small
        :ripple="false"
        height="21"
        variant="text"
        class="px-3badge-font-size ms-auto text-primary"
      >{{ tag }}</v-btn
      >
    </div>
    <v-row align="center" justify="center" dense>
      <v-col
        v-for="(quizz, id) in allQuizz" :key="id" lg="4" md="4" cols="12" class="h-full">
        <v-card
          class="h-full d-flex flex-column justify-between"
          rounded="xl" variant="text"
          bordered
        >
          <div class="px-4 pt-4">
            <h6 class="mb-0 text-h6 text-typo">{{ truncate(quizz.title, 20) }}</h6>
          </div>
          <hr class="horizontal dark mt-2 mb-1" />
          <v-card-text>
            <NuxtLink :to="'/quizz/' + quizz.name" class="border-teal-500">
              <div class="h-48 lg:h-40 overflow-hidden relative">
                <v-avatar v-if = "quizz.icon" class="absolute z-20 top-2 left-2 bg-gray-700" size="md">
                  <v-icon dynamic :name="quizz.icon"/>
                </v-avatar>
                <NuxtImg
                  :src="quizzImg(quizz)"
                  :alt="quizz.title"
                  layout="responsive"
                  width="200"
                  height="200"
                  class="border-radius-lg shadow-lg"
                  :preload="true"
                  loading="eager"
                  fetchpriority="high"
                />
              </div>
            </NuxtLink>
          </v-card-text>

          <v-card-actions>
            <span v-for="(badge, i) in quizz.badges?.split(',')" class="mr-2">
                <v-btn
                  :key="i"
                  :ripple="false"
                  height="21"
                  variant="text"
                  color="indigo"
                >{{ badge }}</v-btn
                >
              </span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { truncate } from '~/utils/stringUtils'
import Header from "~/components/App/AppQuiz/Header.vue";

const { data: allQuizz } = await useAsyncData("allQuizz", () =>
  queryContent("/quizz").find()
);

const title  = "Dynamic quizzes generated using Wikidata and SPARQL.";
const description = "Wikidata quizzes generated with SPARQL on various topics : " + allQuizz.value.map(q => q.title).join(', ') ;

const quizzImg = quizz => {
  const img = quizz.image ?? "quizz-sparql.png"
  return  "quizz/" + img
}

const tags = [
  'quizz',
  "sparql",
  "wikipedia",
  "wikidata",
];
</script>
