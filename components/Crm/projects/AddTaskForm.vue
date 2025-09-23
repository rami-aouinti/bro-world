<script lang="ts" setup>
import BaseAddCard from "~/components/Crm/BaseAddCard.vue";

const newTask = ref({
  name: '',
  description: '',
  projectId: '',
})

const { addTask, error } = useTasks()
const { projects } = useProjects()

const handleSubmit = () => {
  addNewTask(newTask.value)
  newTask.value = { name: '', description: '', projectId: '' }
}

const addNewTask = async (item) => {
  await addTask(item)
  errorHandler(error, 'task', 'added')
}

const projectOptions = computed(() =>
  projects.value.map((project) => ({ label: project.name, value: project.id }))
)
</script>

<template>
  <BaseAddCard title="Add New Task" icon="i-heroicons-check" @submit="handleSubmit">
    <v-form label="Task Name">
      <v-input v-model="newTask.name" required placeholder="Enter task name" />
    </v-form>
    <v-form label="Description">
      <v-textarea v-model="newTask.description" placeholder="Enter task description (optional)" />
    </v-form>
    <v-form label="Project">
      <v-select
        v-model="newTask.projectId"
        :options="projectOptions"
        required
        placeholder="Select a project"
      />
    </v-form>
    <template #actions>
      <v-btn color="primary" type="submit">Add Task</v-btn>
    </template>
  </BaseAddCard>
</template>
