<script setup lang="ts">
import TopicCard from '~/components/Course/elements/TopicCard.vue'

const route = useRoute()
const { data: rows } = await useFetch('/api/course/topics', { key: route.fullPath })

definePageMeta({
  title: 'Tutorials',
  icon: 'mdi-animation',
  middleware: 'auth',
  requiredRoles: ['ROLE_USER'],
})
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="rows">
          <div aria-label="group of cards" tabindex="0" class="py-4 w-full">
            <div v-for="row in rows" :key="row.id" class="lg:flex items-center justify-center w-full">
              <div
                v-for="topic in row"
                :key="topic.id"
                class="shadow rounded transition"
                :class="{
                  'hover:dark:shadow-green-400 hover:shadow-green-400': topic.accentColor === 'green',
                  'hover:dark:shadow-red-400 hover:shadow-red-400': topic.accentColor === 'red',
                  'hover:dark:shadow-indigo-400 hover:shadow-indigo-400': topic.accentColor === 'indigo',
                }"
              >
                <TopicCard :topic="topic" />
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
