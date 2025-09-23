<script lang="ts" setup>
import BaseAddCard from "~/components/Crm/BaseAddCard.vue";
import AutoDropdown from "~/components/Crm/AutoDropdown.vue";

const newNote = ref({
  body: '',
  contact_method: '',
  relatedCustomers: [],
})

const { addNote, error } = useNotes()
const { customers} = useCustomers()

const handleSubmit = () => {
  addNewNote(newNote.value)
  newNote.value = { body: '', contact_method: '', relatedCustomers: [] }
}

const addCustomer = (customer) => {
  if (!newNote.value.relatedCustomers.some((c) => c.id === customer.id)) {
    newNote.value.relatedCustomers.push(customer)
  }
}

const removeCustomer = (index) => {
  newNote.value.relatedCustomers.splice(index, 1)
}

const addNewNote = async (item) => {
  await addNote(item)
  errorHandler(error, 'note', 'added')
}
</script>

<template>
  <BaseAddCard title="Add New Note" icon="i-heroicons-pencil" @submit="handleSubmit">
    <v-form label="Message">
      <v-textarea v-model="newNote.body" required />
    </v-form>
    <v-divider label="optional" :ui="{ label: 'opacity-60' }" />
    <v-form label="Contact Method" class="">
      <div class="flex flex-row gap-x-0">
        <v-radio-group
          :options="contactMethods"
          v-model="newNote.contact_method"
          :ui="{
            fieldset: 'grid grid-cols-2 gap-x-5',
          }"
        />
        <v-btn
          @click="newNote.contact_method = ''"
          class="text-xs max-h-8"
          v-if="newNote.contact_method"
          variant="ghost"
        >
          Clear
        </v-btn>
      </div>
    </v-form>
    <v-form label="Related Customers">
      <div class="flex flex-row flex-wrap max-w-full gap-1">
        <div
          v-for="(customer, index) in newNote.relatedCustomers"
          :key="customer.id"
          class="text-xs"
        >
          <v-btn
            color="gray"
            variant="ghost"
            @click="removeCustomer(index)"
            class="py-2 px-3 text-md bg-primary opacity-90 rounded-full"
          >
            {{ customer.name }}
          </v-btn>
        </div>
      </div>
      <AutoDropdown
        :options="customers"
        placeholder="Add a related customer..."
        option-attribute="name"
        @update:modelValue="addCustomer"
        class="mt-2"
      />
    </v-form>
    <template #actions>
      <v-btn color="primary" type="submit">Add Note</v-btn>
    </template>
  </BaseAddCard>
</template>
