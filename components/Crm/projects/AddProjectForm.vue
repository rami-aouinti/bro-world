<script lang="ts" setup>
import BaseAddCard from "~/components/Crm/BaseAddCard.vue";

const newProject = ref({
  name: '',
  description: '',
  companyId: '',
})

const { addProject, error } = useProjects()
const { companies } = useCompanies()

const handleSubmit = () => {
  addNewProject(newProject.value)
  newProject.value = { name: '', description: '', companyId: '' }
}

const addNewProject = async (item) => {
  await addProject(item)
  errorHandler(error, 'project', 'added')
}
</script>

<template>
  <BaseAddCard title="Add New Project" icon="i-heroicons-briefcase" @submit="handleSubmit">
    <v-form label="Project Name">
      <v-input v-model="newProject.name" required />
    </v-form>
    <v-form label="Description">
      <v-textarea v-model="newProject.description" />
    </v-form>
    <v-form label="Company">
      <v-select
        v-model="newProject.companyId"
        :options="companies.map((company) => ({ label: company.name, value: company.id }))"
        required
      />
    </v-form>
    <template #actions>
      <v-btn color="primary" type="submit">Add Project</v-btn>
    </template>
  </BaseAddCard>
</template>
