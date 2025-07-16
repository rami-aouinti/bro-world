<template>
  <v-container fluid>
    <Header class="mb-6 text-center" :title="quizzContent.title" :description="quizzContent.description" :icon="quizzContent.icon" />
    <RandomSparql
      :quizz = "quizzContent"
      :data-name = "name"
      :sparqlQuery="sparqlRequest" />
  </v-container>
</template>

<script setup>

import Header from "~/components/App/AppQuiz/Header.vue";
import RandomSparql from "~/components/Quizz/RandomSparql.vue";

const route = useRoute()
const { name } = route.params
const event = useRequestEvent()
const { data: quizzContent } = await useAsyncData("quizzContent", () =>
  queryContent("/quizz/" + name).findOne()
);

if (event && !quizzContent.value) {
  throw createError({ statusCode: 404, statusMessage: 'Aucun quizz trouvé à cette adresse' })
}

const sparqlRequest = quizzContent.value.body.children[0].props.code
const baseUrl = "https://bro-world-space.com" + route.fullPath.split(name)[0]
const img =  quizzContent.value.image ?? "quizz-sparql.png"
const title = quizzContent.value.title + " - Quizz dynamique wikidata"
const description = "Quizz dynamique généré avec Wikidata et sparql sur le thème : " + quizzContent.value.title

useSeoMeta({
  title: title,
  description: description,
  author: "rami.aouinti@gmail.com",

  ogImage: baseUrl + img,
  ogUrl: baseUrl + name,
  ogTitle: title,
  ogDescription: description,
});

</script>

<style lang="scss" >

[data-name="swift"], [data-name="beatles"]  {

  li:has(img) div {
    background: aliceblue;
  }

}

</style>
