<script lang="ts" setup>
import AutoDropdown from "~/components/Crm/AutoDropdown.vue";

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

// generic const and functions
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

// log specific functions
const { projects, fetchProjects } = useProjects()
const { tasks, fetchTasks } = useTasks()
fetchProjects()
fetchTasks()

const updateProject = (project) => {
  editingItem.value.projectId = project.id
  editingItem.value.project.name = project.name
  // Reset task when project changes
  editingItem.value.taskId = null
  editingItem.value.task.name = ''
}

const updateTask = (task) => {
  editingItem.value.taskId = task.id
  editingItem.value.task.name = task.name
}

// Function to format seconds to HH:MM:SS
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Function to parse HH:MM:SS to seconds
const parseTime = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number)
  return hours * 3600 + minutes * 60 + seconds
}
</script>

<template>
  <v-dialog :model-value="isOpen" @close="closeModal">
    <v-card>
      <template #header>
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Edit Log</h3>
      </template>
      <div v-if="editingItem" class="mt-2 space-y-4">
        <v-form label="Project">
          <AutoDropdown
            :options="projects"
            :modelValue="editingItem.project.name"
            placeholder="Select a project..."
            option-attribute="name"
            @update:modelValue="updateProject"
          />
        </v-form>
        <v-form label="Task">
          <AutoDropdown
            :options="tasks.filter((task) => task.projectId === editingItem.projectId)"
            :modelValue="editingItem.task.name"
            placeholder="Select a task..."
            option-attribute="name"
            @update:modelValue="updateTask"
          />
        </v-form>
        <v-form label="Elapsed Time">
          <v-input v-model="editingItem.elapsedTime" :formatter="formatTime" :parser="parseTime" />
        </v-form>
        <v-form label="Date">
          <v-input v-model="editingItem.createdAt" type="date" />
        </v-form>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <v-btn color="gray" @click="closeModal"> Cancel </v-btn>
          <v-btn color="primary" @click="saveEditedItem"> Save Changes </v-btn>
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>
