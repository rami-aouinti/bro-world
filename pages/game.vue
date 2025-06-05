<template>
  <v-container fluid>
    <v-row align="center" justify="center" dense>
      <v-col cols="12" md="12">
        <h1 class="text-2xl m-3">
          <span class="text-teal-400 mr-4">Quiz</span>
          {{ title }}
        </h1>
        <p class="text-left [&>a]:text-teal-400 [&>a]:underline">
          The <NuxtLink to="https://en.wikipedia.org/wiki/SPARQL" target="_blank">SPARQL</NuxtLink> language
          allows querying RDF databases such as
          <NuxtLink to="https://www.wikidata.org/wiki/Wikidata:Main_Page" target="_blank">Wikidata</NuxtLink>.
          Each quiz is generated from a SPARQL query, and the data changes with every page reload.
        </p>
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
        class="px-3badge-font-size ms-auto text-success"
      >{{ tag }}</v-btn
      >
    </div>
    <v-row align="center" justify="center" dense>
      <v-col v-for="(quizz, id) in allQuizz" :key="id" cols="12" md="4">
        <v-card
          dark
          append-icon="mdi-check"
          class="mx-auto border-primary"
          prepend-icon="mdi-account"
          :title="quizz.title"
          :description="quizz.description"
          bordered
        >
          <v-card-text>
            <NuxtLink :to="'/quizz/' + quizz.name" class="border-teal-500">
              <div class="h-48 lg:h-40 overflow-hidden relative">
                <v-avatar v-if = "quizz.icon" class="absolute z-20 top-2 left-2 bg-gray-700" size="md">
                  <v-icon dynamic :name="quizz.icon"/>
                </v-avatar>
                <NuxtImg :src="quizzImg(quizz)" :alt="quizz.title" height="300" width="400" class="opacity-30"/>
              </div>
              <div class="py-4">
                <h5 class="text-xl font-bold">{{ quizz.title }}</h5>
                <p>{{ quizz.description }}</p>
              </div>
            </NuxtLink>
          </v-card-text>

          <v-card-actions>
            <span v-for="(badge, i) in quizz.badges?.split(',')" class="mr-2">
                <v-btn
                  :key="i"
                  small
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

<script setup>

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
