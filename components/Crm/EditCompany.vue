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

// Company-specific functions
const addEmployee = (employee) => {
  if (!editingItem.value.employeeIds.includes(employee.id)) {
    editingItem.value.employeeIds.push(employee.id)
  }
}

const removeEmployee = (index) => {
  editingItem.value.employeeIds.splice(index, 1)
}

const { customers, fetchCustomers } = useCustomers()
fetchCustomers()
</script>

<template>
  <v-dialog :model-value="isOpen" @close="closeModal">
    {{ editingItem.isEvaluation }}
    <v-card>
      <template #header>
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Edit Company
        </h3>
      </template>
      <div v-if="editingItem" class="mt-2 space-y-4">
        <v-form label="Company Name">
          <v-input v-model="editingItem.name" />
        </v-form>
        <v-form label="City">
          <v-input v-model="editingItem.city" />
        </v-form>
        <v-form label="Country">
          <v-input v-model="editingItem.country" />
        </v-form>
        <v-form label="Website URL">
          <v-input v-model="editingItem.websiteUrl" type="url" />
        </v-form>
        <v-form label="Is Evaluation?" class="flex flex-row items-center gap-2">
          <v-checkbox v-model="editingItem.isEvaluation" />
        </v-form>
        <v-form label="Customers">
          <div class="flex flex-row flex-wrap max-w-full gap-1">
            <div
              v-for="(employeeId, index) in editingItem.employeeIds"
              :key="employeeId"
              class="text-xs"
            >
              <v-btn
                color="gray"
                variant="ghost"
                @click="removeEmployee(index)"
                class="py-2 px-3 text-md bg-primary opacity-90 rounded-full"
              >
                {{ customers.find((c) => c.id === employeeId)?.name || employeeId }}
              </v-btn>
            </div>
          </div>
          <AutoDropdown
            :options="customers"
            placeholder="Add a employee..."
            option-attribute="name"
            @update:modelValue="addEmployee"
            class="mt-2"
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
