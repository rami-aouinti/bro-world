<template>
  <v-main class="bg-teal-400/5 p-4 space-y-8 my-main-bg">
    <h1 class="flex items-center gap-2 text-2xl">
      <v-avatar
        v-for="logo in logos"
        :key="logo"
        :src="'https://logo.clearbit.com/' + logo"
        class="w-12 h-12 mr-2 bg-white"
        size="md"
      />
      {{ title }}
    </h1>
    <h2 class="opacity-75 h-5 text-lg">{{ description }}</h2>

    <v-slide-y-transition group tag="div" class="space-y-4">
      <v-chip
        v-for="(tag, id) in shownTags"
        :key="id"
        color="teal-darken-3"
        class="mr-2"
        label
        variant="elevated"
      >
        {{ tag }}
      </v-chip>
    </v-slide-y-transition>

    <v-alert type="info" class="pl-5">
      <template #title>Liens utiles</template>
      <v-list density="compact">
        <v-list-item
          v-for="(link, i) in links"
          :key="i"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ link.name }}
        </v-list-item>
      </v-list>
    </v-alert>

    <v-card class="bg-white/15 p-4 rounded-lg shadow backdrop-blur">
      <v-card-title class="text-lg mb-2">Créatrices à mettre à jour</v-card-title>
      <v-list>
        <v-list-item
          v-for="scientist in scientists"
          :key="scientist.name"
          :href="scientist.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <v-list-item-title>{{ scientist.name }}</v-list-item-title>
          <v-list-item-subtitle class="text-white/50">{{ scientist.field }}</v-list-item-subtitle>
          <div v-if="scientist.description" class="text-sm text-white/70 mt-1">{{ scientist.description }}</div>
        </v-list-item>
      </v-list>
    </v-card>

    <section v-if="alsacianItems" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <v-card
        v-for="item in alsacianItems"
        :key="item.creatrice.value"
        class="hover:scale-105 transition-transform"
      >
        <v-img
          :src="item.image?.value || 'https://logo.clearbit.com/wikipedia.org'"
          :alt="item.creatriceLabel?.value"
          height="200"
          cover
        />
        <v-card-title>
          <a
            :href="item.article.value"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-500 hover:underline"
          >
            {{ item.creatriceLabel?.value }}
          </a>
        </v-card-title>
        <v-card-subtitle v-if="item.lieuNaissanceLabel?.value">
          Lieu de naissance: {{ item.lieuNaissanceLabel.value }}
        </v-card-subtitle>
      </v-card>
    </section>

    <v-expansion-panels v-if="items">
      <v-expansion-panel v-for="creatrice in items" :key="creatrice.creatrice.value">
        <v-expansion-panel-title>
          <a :href="creatrice.creatrice.value" target="_blank" rel="noopener noreferrer">
            {{ creatrice?.creatriceLabel?.value }}
          </a>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          Modifiée le : {{ new Date(creatrice?.modified?.value).toLocaleDateString() }}
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-main>
</template>

<script setup>
const title = "Atelier Wikipédia"
const description = "Femmes illustres et de science "

const tags = [
  "Wikipédia",
  "Wikidata",
  "éditathon",
  "créatrices",
  "BNU - Lab",
  "Urfist",
];
const shownTags = ref([])
const timeBetweenTags = 50

onMounted(() => {
  for (let i = 0; i < tags.length; i++) {
    setTimeout(() => {
      shownTags.value.push(tags[i])
    }, timeBetweenTags * i);
  }
})

const links = [
  { name: "Pad", url: "https://urls.fr/F79H3I" },
  { name: "Page projet", url: "https://fr.wikipedia.org/wiki/Projet:Wikifier_la_science/Strasbourg/%C3%89ditathon_Bnu" },
  { name: "Wikimedia", url: "https://wikimedia.org/" },
  { name: "Wikipédia", url: "https://wikipedia.org/" },
  { name: "Wikidata", url: "https://wikidata.org/" },
]

const logos = ["wikipedia.org", "wikidata.org"]

const scientists = [
  {
    name: "Catherine Tallon-Baudry",
    field: "Neurosciences",
    url: 'https://fr.wikipedia.org/wiki/Catherine_Tallon-Baudry'
  },
  {
    name: "Janne Blichert-Toft",
    field: "Géochimie",
    description: "La page est quasi-vide, tout est à faire : biographie et travaux.",
    url: 'https://fr.wikipedia.org/wiki/Janne_Blichert-Toft'
  },
  {
    name: "Christiane Marchello-Nizia",
    field: "Linguistique",
    description: "Ajout des travaux, un peu d'ajout de sources",
    url: 'https://fr.wikipedia.org/wiki/Christiane_Marchello-Nizia'
  },
  {
    name: "Florence Ader",
    field: "Médecine",
    description: "Développement des travaux sur le COVID",
    url: 'https://fr.wikipedia.org/wiki/Florence_Ader'
  },
  {
    name: "Ingrid Daubechies",
    field: "Physique",
    description: "Sourçage, développement et vulgarisation des travaux.",
    url: 'https://fr.wikipedia.org/wiki/Ingrid_Daubechies'
  },
  {
    name: "Nina Léger",
    field: "Littérature ; Histoire de l'art",
    description: "Ajout des thèmes abordés par l'écrivaine (sexualité, écologie, États-Unis).",
    url: 'https://fr.wikipedia.org/wiki/Nina_L%C3%A9ger'
  },
]

const alsacianItems = ref([])
const items = ref([])
</script>

<style scoped>
a:hover {
  text-shadow:
    0 0 7px rgba(0, 255, 170, 0.288),
    0 0 10px rgba(0, 255, 170, 0.288),
    0 0 21px rgba(0, 255, 170, 0.288),
    0 0 42px rgba(0, 255, 170, 0.288);
}
</style>
