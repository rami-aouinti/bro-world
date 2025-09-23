<script lang="ts" setup>
import BaseAddCard from "~/components/Crm/BaseAddCard.vue";
import AutoDropdown from "~/components/Crm/AutoDropdown.vue";

const newCompany = ref({
  name: '',
  city: '',
  country: '',
  websiteUrl: '',
  isEvaluation: false,
  employeeIds: [],
})

const { addCompany } = useCompanyStore()
const { customers } = useCustomers()
const toast = useToast()

const handleSubmit = async () => {
  try {
    await addCompany(newCompany.value)
    toast.add({ title: 'Success', description: 'Company added successfully', color: 'green' })
    resetForm()
  } catch (error) {
    console.error('Error adding company:', error)
    toast.add({ title: 'Error', description: 'Failed to add company', color: 'red' })
  }
}

const resetForm = () => {
  newCompany.value = {
    name: '',
    city: '',
    country: '',
    websiteUrl: '',
    isEvaluation: false,
    employeeIds: [],
  }
}

const addEmployee = (employee) => {
  if (!newCompany.value.employeeIds.includes(employee.id)) {
    newCompany.value.employeeIds.push(employee.id)
  }
}

const removeEmployee = (index) => {
  newCompany.value.employeeIds.splice(index, 1)
}
</script>

<template>
  <BaseAddCard title="Add New Company" icon="i-heroicons-building-office" @submit="handleSubmit">
    <v-form label="Company Name">
      <v-input v-model="newCompany.name" required />
    </v-form>
    <v-form label="City">
      <v-input v-model="newCompany.city" />
    </v-form>
    <v-form label="Country">
      <v-input v-model="newCompany.country" />
    </v-form>
    <v-form label="Website URL">
      <v-input v-model="newCompany.websiteUrl" />
    </v-form>
    <v-form label="Is Evaluation?" class="flex flex-row gap-2 items-center">
      <v-checkbox v-model="newCompany.isEvaluation" />
    </v-form>
    <v-form label="Employees">
      <div class="flex flex-row flex-wrap max-w-full gap-1">
        <div v-for="employeeId in newCompany.employeeIds" :key="employeeId" class="text-xs">
          <v-btn
            color="gray"
            variant="ghost"
            @click="removeEmployee(newCompany.employeeIds.indexOf(employeeId))"
            class="py-2 px-3 text-md bg-primary opacity-90 rounded-full"
          >
            {{ customers.find((c) => c.id === employeeId)?.name || employeeId }}
          </v-btn>
        </div>
      </div>
      <AutoDropdown
        :options="customers"
        placeholder="Add an employee..."
        option-attribute="name"
        @update:modelValue="addEmployee"
        class="mt-2"
      />
    </v-form>
    <template #actions>
      <v-btn color="primary" type="submit">Add Company</v-btn>
    </template>
  </BaseAddCard>
</template>
