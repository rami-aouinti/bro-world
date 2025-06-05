<template>
  <div>
    <div v-if="labNumbers?.length">
      <div class="flex flex-wrap gap-4 justify-center">
        <!-- Bloc chiffre animé -->
        <v-card class="pa-4 bg-gray-100 border rounded-md" elevation="1">
          <div class="font-extrabold text-lg text-gray-700 text-center">
            In 2023, the Lab hosted:
            <div class="inline-flex flex-col h-[2em] overflow-hidden">
              <ul class="leading-tight animate-text-slide">
                <li class="text-indigo-500">{{ lab.n_tot_formations }} trainings</li>
                <li class="text-rose-500">{{ lab.n_tot_events }} events</li>
                <li class="text-yellow-500">{{ lab.n_tot_projets }} unique projects</li>
                <li class="text-teal-500">{{ lab.n_tot_formations }} trainings</li>
                <li class="text-pink-500">{{ lab.n_tot_events }} events</li>
                <li class="text-sky-500">{{ lab.n_tot_projets }} unique projects</li>
              </ul>
            </div>
          </div>
        </v-card>

        <!-- Bloc total heures -->
        <AppTargetNumber :targetNumber="lab.n_tot_heures" />
      </div>

      <v-divider class="my-6" />

      <div class="text-lg font-extrabold text-gray-700 text-center">
        <AppPolarAreaGraph />
      </div>

      <v-divider class="my-6" />

      <div class="pa-4 bg-gray-100 border rounded-md text-center">
        <div class="text-lg font-extrabold text-gray-700 mb-4">Right now, the Lab is...</div>
        <div class="flex flex-wrap gap-4 justify-center">
          <!-- Projects -->
          <div>
            <div class="font-bold text-teal-700">
              ... collaborating on {{ lab.number_current_projects }} projects
            </div>
            <v-progress-circular
              :model-value="capacityProjects"
              size="100"
              width="6"
              color="teal"
              class="mt-2"
            >
              {{ Math.round(capacityProjects) }}%
            </v-progress-circular>
          </div>

          <!-- Formations -->
          <div>
            <div class="font-bold text-teal-700">
              ... preparing {{ lab.number_current_formas }} trainings
            </div>
            <v-progress-circular
              :model-value="capacityForma"
              size="100"
              width="6"
              color="teal"
              class="mt-2"
            >
              {{ Math.round(capacityForma) }}%
            </v-progress-circular>
          </div>

          <!-- Events -->
          <div>
            <button @click="startFireWorks = !startFireWorks">
              <div class="font-bold text-teal-700">
                ... preparing {{ lab.number_current_events }} events
              </div>
              <v-progress-circular
                :model-value="capacityAutre"
                size="100"
                width="6"
                color="teal"
                class="mt-2"
              >
                {{ Math.round(capacityAutre) }}%
              </v-progress-circular>
            </button>
          </div>
        </div>
      </div>

      <div v-if="startFireWorks">
        <AppFires class="opacity-60" />
        <div class="absolute inset-0 flex justify-center items-center text-black z-50">
          <div class="bg-white/80 rounded-lg shadow-lg p-5 w-80">
            <h3 class="text-2xl text-center">Bravo!</h3>
            <p class="text-center font-bold">
              You have completed all challenges. Time to enjoy some well-deserved rest!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: labNumbers } = await useAsyncData('quizz/annilab', () => queryContent('/quizz/annilab').find())

const lab = computed(() => labNumbers.value?.[0] ?? {})
const capacityProjects = computed(() => lab.value.number_current_projects / lab.value.capacity_projects * 100)
const capacityForma = computed(() => lab.value.number_current_formas / lab.value.capacity_formas * 100)
const capacityAutre = computed(() => lab.value.number_current_events / lab.value.capacity_autre * 100)

const startFireWorks = ref(false)
</script>

<style scoped>
.animate-text-slide {
  animation: text-slide 12.5s cubic-bezier(0.83, 0, 0.17, 1) infinite;
}

@keyframes text-slide {
  0%, 16% {
    transform: translateY(0%);
  }
  20%, 36% {
    transform: translateY(-16.66%);
  }
  40%, 56% {
    transform: translateY(-33.33%);
  }
  60%, 76% {
    transform: translateY(-50%);
  }
  80%, 96% {
    transform: translateY(-66.66%);
  }
  100% {
    transform: translateY(-83.33%);
  }
}
</style>
