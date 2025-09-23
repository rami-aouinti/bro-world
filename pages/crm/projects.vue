<script lang="ts" setup>
import AddProjectForm from '~/components/Crm/projects/AddProjectForm.vue'
import AddTaskForm from '~/components/Crm/projects/AddTaskForm.vue'
import ProjectsTable from '~/components/Crm/projects/ProjectsTable.vue'
import TasksTable from '~/components/Crm/projects/TasksTable.vue'

const { projects, fetchProjects, updateProject, deleteProject } = useProjects()
const { companies, fetchCompanies } = useCompanies()
const { tasks, fetchTasks, updateTask, deleteTask } = useTasks()
fetchProjects()
fetchTasks()
fetchCompanies()
fetchProjects()
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <AddTaskForm class="col-span-2 md:col-span-1" />
    <AddProjectForm class="col-span-2 md:col-span-1" />
    <TasksTable class="col-span-2" />
    <ProjectsTable class="col-span-2" />
  </div>
</template>
