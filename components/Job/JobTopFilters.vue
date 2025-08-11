<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['update:search', 'update:location', 'update:experience', 'update:salaryRange', 'update:skills', 'update:work', 'update:contract'])
const { t } = useI18n()
const props = defineProps<{
  experienceOptions: number[]
  companies: any[]
}>()
const search = ref('')
const selectedLocations = ref('')
const filter = ref(false)
const selectedExperience = ref<number | null>(null)
const salaryRange = ref(50)
const selectedCompany = ref(null)
const selectedSkills = ref<string[]>([])
const selectedWorkType = ref<string[]>([])
const selectedContractType = ref<string[]>([])
const skillsOptions = ['Php', 'Symfony', 'Vue', 'Laravel', 'Api', 'Html', 'Css']
const workOptions = ['Remote','Onsite','Hybrid']
const contractOptions = ['Fulltime','Parttime']
const companyNames = computed(() => props.companies.map(c => c.name))

watch(selectedExperience, val => emit('update:experience', val))
watch(selectedCompany, val => emit('update:company', val))
watch(salaryRange, val => emit('update:salaryRange', val))
watch(selectedSkills, val => emit('update:skills', val))
watch(selectedWorkType, val => emit('update:work', val))
watch(selectedContractType, val => emit('update:contract', val))
watch(search, val => emit('update:search', val))
watch(selectedLocations, val => emit('update:location', val))
</script>
<template>
  <v-row>
    <v-col cols="12" md="6" lg="4">
      <v-text-field v-model="search" :placeholder="t('job.search')" prepend-inner-icon="mdi-magnify" variant="outlined" class="mb-4" rounded="xl" density="compact" />
    </v-col>
    <v-col cols="12" md="6" lg="4">
      <v-text-field v-model="selectedLocations" :label="t('job.location')" prepend-inner-icon="mdi-earth" variant="outlined" multiple chips clearable class="mb-2" rounded="xl" density="compact" />
    </v-col>
    <v-col cols="12" md="6" lg="3">
      <v-select v-model="selectedWorkType" :items="workOptions" multiple :label="t('job.workType')" clearable chips density="compact" rounded="xl" />
    </v-col>
    <v-col cols="12" md="6" lg="1">
      <v-btn size="small" @click="filter = !filter" class="mx-1" variant="outlined" icon="mdi-filter-variant">
      </v-btn>
    </v-col>
  </v-row>
  <v-row v-if="filter">
    <v-col cols="12" md="6" lg="3">
      <v-combobox
        clearable
        chips
        multiple
        rounded="xl" density="compact"
        v-model="selectedCompany"
        label="Companies"
        :items="companyNames"
      ></v-combobox>
    </v-col>
    <v-col cols="12" md="6" lg="3">
      <v-select v-model="selectedSkills" :items="skillsOptions" label="Skills" multiple chips clearable rounded="xl" density="compact" />
    </v-col>
    <v-col cols="12" md="6" lg="3">
      <v-select v-model="selectedExperience" :items="experienceOptions" :label="t('job.filterByExperience')" rounded="xl" density="compact" />
    </v-col>
    <v-col cols="12" md="6" lg="3">
      <v-select v-model="selectedWorkType" :items="workOptions" multiple :label="t('job.workType')" clearable chips density="compact" rounded="xl" />
    </v-col>
  </v-row>
</template>
