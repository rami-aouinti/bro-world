<template>
  <main class="min-h-screen">
    <Header class="mb-1 text-center" :title="title" :description="description" />

    <div class="space-y-4 text-center">
      <span v-for="(tag, id) in tags" :key="id"
      class = "bg-teal-800 text-white px-1 mr-2 inline-block hover:bg-teal-600 transition-all border-teal-950" >
        {{ tag }}
      </span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col">
        <label for="inputText" class="text-lg font-bold">Texte à transformer</label>
        <textarea id="inputText" v-model="inputText" class="border border-gray-300 p-2 rounded-md h-96"></textarea>
      </div>
      <div class="flex flex-col">
        <label for="outputText" class="text-lg font-bold">Result</label>
        <textarea id="outputText" v-model="outputText" class="border border-gray-300 p-2 rounded-md h-96"></textarea>
      </div>
    </div>

  </main>
</template>

<script setup>

import Header from "~/components/App/AppQuiz/Header.vue";

const inputText = ref("")
const outputText = ref("")

watchEffect(() => {
  const inputLines = inputText.value.split("\n")
  const outputLines = inputLines.map(line => line.substring(line.indexOf("]") + 1))
  outputText.value = outputLines.join("")
})

const title  = "Transformation de texte";
const description = "";

useSeoMeta({
  title: title,
  description,
  author: "A B",
});

const tags = [
];


</script>
