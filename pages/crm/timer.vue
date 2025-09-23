<script lang="ts" setup>
import Stopwatch from '~/components/Crm/timer/Stopwatch.vue'
import LogInput from '~/components/Crm/timer/LogInput.vue'
import LogsTable from '~/components/Crm/timer/LogsTable.vue'

const toast = useToast()
const { addLog, fetchLogs, error } = useLogs()
const {  fetchCompanies } = useCompanies()
const {  fetchProjects } = useProjects()
const {  fetchTasks } = useTasks()
// Fetch initial data
fetchCompanies()
fetchProjects()
fetchTasks()
fetchLogs()

const logItems = ref({
  companyId: null,
  projectId: null,
  taskId: null,
})

const handleLogged = async (time) => {
  if (!logItems.value.companyId || !logItems.value.projectId || !logItems.value.taskId) {
    toast.add({
      title: 'Error',
      description: 'Please select a company, project, and task before logging time.',
      color: 'red'
    })
    return
  }

  logItems.value.elapsedTime = time
  await addLog(logItems.value)
  errorHandler(error, 'log', 'added')
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <LogInput v-model="logItems" />
    <Stopwatch @logged="handleLogged" />
    <LogsTable class="col-span-2" />
  </div>
</template>
