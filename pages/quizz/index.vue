<template>
  <main class="min-h-screen">
    <Header class="mb-5 text-center" :title="title" :description="description" />
    <Drag :picsInit="picsInit" :swap="true" />
  </main>
</template>

<script setup lang="ts">

import Header from "~/components/App/AppQuiz/Header.vue";
import Drag from "~/components/Quizz/Drag.vue";

const title = "IPNI According to Artificial Intelligence";
const description = "Everything is out of order... Try to match each image to the correct first name!";

useSeoMeta({
  title: title,
  description,
  author: "A B",
  ogImage: "https://dev-lab-one.vercel.app/quizz/quizz-ipni.png",
  ogUrl: "https://dev-lab-one.vercel.app/quizz",
  ogType: "website",
  ogTitle: title,
  ogDescription: description,
  themeColor: "primary",
});

const picsInit = [
  { src: 'quizz/art1.png', answer: 'Arthur'},
  { src: 'quizz/art2.png', answer: 'Christophe'},
  { src: 'quizz/art3.png', answer: 'Madeleine'},
  { src: 'quizz/art4.png', answer: 'Ferdi'},
  { src: 'quizz/art5.png', answer: 'Elisa'},
  { src: 'quizz/art6.png', answer: 'Kevin'},
  { src: 'quizz/art7.png', answer: 'Maël'},
  { src: 'quizz/art8.png', answer: 'François'},
  { src: 'quizz/art9.png', answer: 'Jimmy'},
  { src: 'quizz/art10.png', answer: 'Mathilde'},
]

</script>
