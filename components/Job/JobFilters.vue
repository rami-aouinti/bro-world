<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  experienceOptions: number[]
  companies: any[]
}>()
const emit = defineEmits(['update:experience', 'update:salaryRange', 'update:skills', 'update:work', 'update:contract'])
const { t } = useI18n()

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
</script>
<template>
  <v-combobox
    clearable
    chips
    multiple
    rounded="xl" density="compact"
    v-model="selectedCompany"
    label="Companies"
    :items="companyNames"
  ></v-combobox>
  <v-select v-model="selectedSkills" :items="skillsOptions" label="Skills" multiple chips clearable rounded="xl" density="compact" />
  <v-select v-model="selectedExperience" :items="experienceOptions" :label="t('job.filterByExperience')" rounded="xl" density="compact" />
  <v-select v-model="selectedWorkType" :items="workOptions" multiple :label="t('job.workType')" clearable chips density="compact" rounded="xl" />
  <v-select v-model="selectedContractType" :items="contractOptions" multiple :label="t('job.contractType')" clearable chips density="compact" rounded="xl" />
  <v-slider v-model="salaryRange" :label="`${t('job.salaryRange')}: ${salaryRange}k`" thumb-label="always" class="mb-4" :max="200" />
</template>
