<template>
  <v-dialog v-model="isOpen" max-width="500">
    <v-card rounded="xl" :loading="isUpdating">
      <template #loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          :color="color"
          height="4"
          indeterminate
        />
      </template>

      <v-card-title class="text-h6 text-primary px-6 py-4">
        {{ title }}
      </v-card-title>

      <v-card-text>
        <slot />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          v-for="close in closeButton"
          :key="close.text"
          :color="close.color || 'primary'"
          @click="handleAction(close.action)"
        >
          {{ close.text }}
        </v-btn>
        <v-btn
          v-for="save in saveButton"
          :key="save.text"
          :color="save.color || 'primary'"
          :disabled="autoUpdate"
          :loading="isUpdating"
          :variant="isUpdating ? 'tonal' : undefined"
          prepend-icon="mdi-update"
          @click="handleAction(save.action)"
        >
          {{ save.text }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  files: { type: Array as () => File[], default: () => [] },
  forms: { type: [String, Object], default: '' },
  title: { type: String, default: 'Confirmation' },
  color: { type: String, default: 'primary' },
  closeButton: { type: Array, default: () => [] },
  saveButton: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'success', 'error'])

const autoUpdate = ref(false)
const isUpdating = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const handleAction = async (action: string | Function) => {
  if (typeof action === 'string') {
    try {
      isUpdating.value = true

      const formData = new FormData()

      if (Array.isArray(props.files)) {
        props.files.forEach(file => {
          formData.append('files[]', file)
        })
      }

      // Traitement de forms (peut être string ou object)
      if (typeof props.forms === 'object' && props.forms !== null) {
        for (const key in props.forms) {
          if (Object.prototype.hasOwnProperty.call(props.forms, key)) {
            formData.append(key, props.forms[key])
          }
        }
      } else if (typeof props.forms === 'string') {
        formData.append('title', props.forms)
      }

      const { data, error } = await useFetch(action, {
        method: 'POST',
        body: formData,
      })

      isUpdating.value = false

      if (data.value) {
        emit('success', data.value)
        isOpen.value = false
      } else {
        emit('error', error)
        console.error('Fetch error:', error)
      }
    } catch (err) {
      isUpdating.value = false
      emit('error', err)
      console.error('Unexpected error:', err)
    }
  } else if (typeof action === 'function') {
    action()
  }

  isOpen.value = false
}
</script>
