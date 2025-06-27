<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import VariableChipGroup
  from "~/components/Notification/Template/VariableChipGroup.vue";
const search = ref('')
const templates = ref([])
const loading = ref(true)
definePageMeta({
  icon: 'mdi-view-list',
  title: 'Templates',
  requiresAdmin: true,
  drawerIndex: 1,
})

async function fetchTemplates() {
  const { data } = await useFetch('/api/admin/notification/templates')
  if (data.value) {
    templates.value = data.value
    loading.value = false
  }
}

watch(loading, () => {
  fetchTemplates()
}, { immediate: true })
onMounted(await fetchTemplates)

const uploadTemplates = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/admin/notification/template/uploads')
    templates.value = await response.json()
    loading.value = false
  } catch (error) {
    console.error('Error:', error)
    Notify.error(error)
    loading.value = false
  }
}

function getFlagUrl(locale) {
  const code = locale.split('_')[1]
  return `/img/icons/flags/${code}.png`
}
const truncate = (str, maxLength = 20) => {
  return str.length > maxLength ? str.slice(0, maxLength) + '…' : str;
}

</script>

<template>
  <v-card-title>
    <v-row>
      <v-col>
        List of Templates
      </v-col>
      <v-col cols="auto">
        <v-btn
          variant="text"
          :loading="loading"
          :disabled="loading"
          prepend-icon="mdi-autorenew"
          @click="uploadTemplates"
        >
        </v-btn>
      </v-col>
    </v-row>

  </v-card-title>
  <div>

    <v-row>
      <v-col v-if="templates.length > 0" v-for="template in templates" cols="12" md="6">
        <v-card style="min-height: 167px;"
          class="border-radius-xl overflow-visible py-1 mx-1"
          rounded="xl"
          :disabled="loading"
          :loading="loading"
        >
          <template v-slot:loader="{ isActive }">
            <v-progress-linear
              :active="isActive"
              color="deep-purple"
              height="4"
              indeterminate
            ></v-progress-linear>
          </template>
          <v-sheet
            class="v-sheet--offset mx-auto"
            elevation="12"
            max-width="calc(100% - 32px)"
            rounded="lg"
          >
            <div class="mt-3 py-2">
              <div class="font-weight-bold d-flex justify-center">
                <v-img
                  :alt="`${template.name} avatar`"
                  :src="getFlagUrl(template.locale)"
                  max-width="20px"
                  class="me-3"
                ></v-img>
                {{ truncate(template.name, 15) }}
              </div>
            </div>
          </v-sheet>
          <div class="px-1 py-2 mb-1">
            <VariableChipGroup :data="template.variables"></VariableChipGroup>
          </div>
        </v-card>
      </v-col>
      <div v-else>
        <span>
          Load Templates
        </span>
      </div>
    </v-row>
  </div>
</template>
