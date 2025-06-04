<template>
  <v-dialog v-model="isOpen" max-width="500">
    <v-card rounded="xl" :loading="isUpdating">

      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          :color="color"
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-card-title class="text-h6 text-primary px-6 py-4">
        {{ title }}
      </v-card-title>

      <v-card-text>
        <slot></slot>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-for="closeButton in closeButton"
               :key="closeButton.text"
               :color="closeButton.color || 'primary'"
               @click="handleAction(closeButton.action)">
          {{ closeButton.text }}
        </v-btn>
        <v-btn
              v-for="button in saveButton"
               :key="button.text"
               :color="button.color || 'primary'"
              :disabled="autoUpdate"
              :loading="isUpdating"
              :variant="isUpdating ? 'tonal' : undefined"
              prepend-icon="mdi-update"
               @click="handleAction(button.action)">
          {{ button.text }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: Boolean,
  files: { type: Array as () => File[], default: () => [] },
  forms: String,
  title: { type: String, default: "Confirmation" },
  color: { type: String, default: "primary" },
  closeButton: { type: Array, default: () => [] },
  saveButton: { type: Array, default: () => [] },
});

const autoUpdate = ref(false)
const isUpdating = ref(false)

const emit = defineEmits(["update:modelValue", "success", "error"]);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleAction = async (action) => {
  if (typeof action === "string") {
    try {
      isUpdating.value = true
      const formData = new FormData();
      if (Array.isArray(props.files)) {
        props.files.forEach(file => {
          formData.append('files[]', file);
        });
      } else {
        console.error('files is not an array or is undefined');
      }
      formData.append('name', 'story');
      formData.append('title', props.forms);
      const { data, error } = await useFetch(action, {
        method: 'POST',
        body: formData
      });

      if (data.value) {
        emit("success", data);
        isUpdating.value = false
        isOpen.value = false;
      } else {
        emit("error", error);
        isUpdating.value = false
        console.error("Error updating item:", error);
      }

    } catch (error) {
      emit("error", error);
    }
  } else if (typeof action === "function") {
    action();
  }
  isOpen.value = false;
};
</script>
