<script lang="ts" setup>
const props = defineProps({
  selected: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update-item', 'close'])

const editedProject = ref({ ...props.selected })
const { companies } = useCompanies()

watch(
  () => props.selected,
  (newValue) => {
    editedProject.value = { ...newValue }
  }
)

const handleSubmit = () => {
  emit('update-item', editedProject.value)
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <v-dialog :model-value="isOpen" @close="closeModal">
    <v-card>
      <template #header>
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Edit Project
        </h3>
      </template>
      <form @submit.prevent="handleSubmit">
        <v-form label="Project Name">
          <v-input v-model="editedProject.name" required />
        </v-form>
        <v-form label="Description">
          <v-textarea v-model="editedProject.description" />
        </v-form>
        <v-form label="Company">
          <v-select
            v-model="editedProject.companyId"
            :options="companies.map((company) => ({ label: company.name, value: company.id }))"
            required
          />
        </v-form>
        <div class="flex justify-end space-x-2 mt-4">
          <v-btn color="gray" @click="handleClose">Cancel</v-btn>
          <v-btn color="primary" type="submit">Update Project</v-btn>
        </div>
      </form>
    </v-card>
  </v-dialog>
</template>
