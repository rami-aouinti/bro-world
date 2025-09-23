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

// Fetch companies for the company dropdown
const { companies } = useCompanies()
</script>

<template>
  <v-dialog :model-value="isOpen" @close="closeModal">
    <v-card>
      <template #header>
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Edit Customer
        </h3>
      </template>
      <div v-if="editingItem" class="mt-2 space-y-4">
        <v-form label="Name">
          <v-input v-model="editingItem.name" />
        </v-form>
        <v-form label="Email">
          <v-input v-model="editingItem.email" type="email" />
        </v-form>
        <v-form
          :label="`Current Status: ${editingItem.status.charAt(0).toUpperCase() + editingItem.status.slice(1)}`"
        >
          <v-select v-model="editingItem.status" :options="statusOptions" />
        </v-form>
        <v-form label="Company">
          <AutoDropdown
            :options="companies"
            v-model="editingItem.companyId"
            :selected="editingItem.companyId"
            :label="editingItem.companyName"
            :placeholder="editingItem.companyName"
            :search="true"
            :multiple="false"
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
