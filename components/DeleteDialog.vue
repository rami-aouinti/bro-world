<template>
  <v-dialog v-model="isOpen" max-width="400">
    <v-card rounded="xl" :loading="isUpdating">
      <template v-slot:loader="{ isActive }">
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
        <v-btn color="grey" variant="text" @click="isOpen = false">Cancel</v-btn>
        <v-btn
          color="red"
          variant="flat"
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
import { computed, ref, defineEmits, defineProps } from "vue";

const props = defineProps({
  modelValue: Boolean,
  deleteUrl: String,
  itemId: [String, Number],
});

const emit = defineEmits(["update:modelValue", "deleted"]);

const isUpdating = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const confirmDelete = async () => {
  isUpdating.value = true;
  try {
    console.log(`${props.deleteUrl}/${props.itemId}`)
    const { data, error } = await useFetch(`${props.deleteUrl}/${props.itemId}`, {
      method: "DELETE",
    });

    if (!error.value) {
      emit("deleted", props.itemId);
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
