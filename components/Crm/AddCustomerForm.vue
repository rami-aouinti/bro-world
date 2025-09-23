<script lang="ts" setup>
import BaseAddCard from "~/components/Crm/BaseAddCard.vue";

const newCustomer = ref({
  name: '',
  email: '',
  status: 'Pending',
  companyId: '',
})

const { addCustomer } = useCustomers()
const { companies } = useCompanyStore()


const handleSubmit = async () => {
  if (!newCustomer.value.companyId) {
    toast.add({ title: 'Error', description: 'Please select a company', color: 'red' })
    return
  }

  try {
    await addCustomer(newCustomer.value)
    toast.add({ title: 'Success', description: 'Customer added successfully', color: 'green' })
    resetForm()
  } catch (error) {
    console.error('Error adding customer:', error)
    toast.add({ title: 'Error', description: 'Failed to add customer', color: 'red' })
  }
}

const resetForm = () => {
  newCustomer.value = {
    name: '',
    email: '',
    companyId: '',
    status: 'Pending',
  }
}
</script>

<template>
  <BaseAddCard
  title="Add New Customer"
  icon="i-heroicons-user"
  helpText="Customer is also an employee of the selected company."
  @submit="handleSubmit">
    <v-form label="Name">
      <v-input v-model="newCustomer.name" required />
    </v-form>
    <v-form label="Email">
      <v-input v-model="newCustomer.email" type="email" required />
    </v-form>
    <v-form label="Status">
      <v-select v-model="newCustomer.status" :options="statusOptions" required />
    </v-form>
    <v-form label="Company">
      <v-select
        v-model="newCustomer.companyId"
        :options="companies"
        option-attribute="name"
        value-attribute="id"
        placeholder="Select a company..."
        required
      />
    </v-form>
    <template #actions>
      <v-btn color="primary" type="submit">Add Customer</v-btn>
    </template>
  </BaseAddCard>
</template>
