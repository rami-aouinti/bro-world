<template>
  <v-dialog v-model="isOpen" max-width="400">
    <v-card rounded="xl" :loading="isUpdating">
      <template #loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="primary"
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-card-title class="text-h6 text-primary">
        Confirmation
      </v-card-title>

      <v-card-text>
        Are you sure you want to delete this item?
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <template v-for="btn in closeButton" :key="btn.text">
          <v-btn :color="btn.color || 'grey'" @click="handleAction(btn.action)">
            {{ btn.text }}
          </v-btn>
        </template>
        <v-btn
          color="primary"
          :loading="isUpdating"
          prepend-icon="mdi-delete"
          @click="confirmDelete"
        >
          Remove
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

interface DialogButton {
  text: string
  color?: string
  action: string | (() => void)
}

const props = defineProps<{
  modelValue: boolean
  deleteUrl?: string
  closeButton?: DialogButton[]
}>()
const emit = defineEmits(["update:modelValue", "deleted"]);

const isUpdating = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

const handleAction = async (action: string | (() => void)) => {
  if (typeof action === 'function') {
    try {
      action()
    } catch (err) {
      console.error('Error in custom action:', err)
    }
    return
  }

  if (action === 'close') {
    isOpen.value = false
    return
  }
}

const confirmDelete = async () => {
  isUpdating.value = true;
  try {
    const { data, error } = await useFetch(`${props.deleteUrl}`, {
      method: "DELETE",
    });

    if (!error.value) {
      emit("deleted");
      emit('update:modelValue', false)
      isOpen.value = false;
    } else {
      console.error("Error remove :", error.value);
    }
  } catch (err) {
    console.error("Error :", err);
  } finally {
    isUpdating.value = false;
  }
};
</script>
