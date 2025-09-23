<script lang="ts" setup>
import AddCompanyForm from "~/components/Crm/AddCompanyForm.vue";
import AddCustomerForm from "~/components/Crm/AddCustomerForm.vue";
import CustomersTable from "~/components/Crm/CustomersTable.vue";
import CompaniesTable from "~/components/Crm/CompaniesTable.vue";

const { fetchCustomers } =  useCustomers()
const {  fetchCompanies } = useCompanies()
fetchCompanies()
fetchCustomers()
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <AddCompanyForm class="col-span-2 md:col-span-1" />
    <AddCustomerForm class="col-span-2 md:col-span-1" />
    <CustomersTable class="col-span-2" />
    <CompaniesTable class="col-span-2" />
  </div>
</template>
