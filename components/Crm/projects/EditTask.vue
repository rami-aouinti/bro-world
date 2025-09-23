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
const editingItem = ref(null)

watch(
  () => props.selected,
  (newValue) => {
    if (newValue) {
      editingItem.value = { ...newValue }
    }
  },
  { immediate: true }
)

const closeModal = () => {
  emit('close')
}

const saveEditedItem = () => {
  emit('update-item', editingItem.value)
  closeModal()
}

// Task specific functions
const { projects, fetchProjects } = useProjects()

</script>

<template>
  <v-dialog :model-value="isOpen" @close="closeModal">
    <v-card>
      <template #header>
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Edit Task</h3>
      </template>
      <div v-if="editingItem" class="mt-2 space-y-4">
        <v-form label="Task Name">
          <v-input v-model="editingItem.name" required />
        </v-form>
        <v-form label="Description">
          <v-textarea v-model="editingItem.description" rows="4" />
        </v-form>
        <v-form label="Project">
          <v-select
            v-model="editingItem.projectId"
            :options="projects.map(project => ({ label: project.name, value: project.id }))"
            required
          />
        </v-form>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <v-btn color="gray" @click="closeModal">Cancel</v-btn>
          <v-btn color="primary" @click="saveEditedItem">Save Changes</v-btn>
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>
