<template>
  <v-dialog v-model="isOpen" max-width="600">
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
        <template v-for="btn in closeButton" :key="btn.text">
          <v-btn
            :color="btn.color || 'grey'"
            @click="handleAction(btn.action)"
          >
            {{ btn.text }}
          </v-btn>
        </template>
        <template v-for="btn in saveButton" :key="btn.text">
          <v-btn
            :color="btn.color || color"
            :loading="isUpdating"
            :disabled="autoUpdate"
            :variant="isUpdating ? 'tonal' : undefined"
            prepend-icon="mdi-content-save"
            @click="handleAction(btn.action)"
          >
            {{ btn.text }}
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface DialogButton {
  text: string
  color?: string
  action: string | (() => void)
}

const props = defineProps<{
  modelValue: boolean
  title?: string
  color?: string
  forms?: Record<string, any> | string
  files?: File[]
  closeButton?: DialogButton[]
  saveButton?: DialogButton[]
}>()

const emit = defineEmits(['update:modelValue', 'success', 'error'])

const isUpdating = ref(false)
const autoUpdate = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

const handleAction = async (action: string | (() => void)) => {
  // 👉 Si l'action est une fonction personnalisée
  if (typeof action === 'function') {
    try {
      action() // laisse la fonction décider si elle ferme le dialogue ou non
    } catch (err) {
      console.error('Error during custom action:', err)
    }
    return
  }

  // 👉 Sinon on part sur un appel API avec POST multipart
  try {
    isUpdating.value = true

    const formData = new FormData()

    if (props.files?.length) {
      props.files.forEach(file => formData.append('files[]', file))
    }

    if (typeof props.forms === 'object' && props.forms !== null) {
      for (const [key, value] of Object.entries(props.forms)) {
        formData.append(key, value)
      }
    } else if (typeof props.forms === 'string') {
      formData.append('title', props.forms)
    }

    const  data = await $fetch(action, {
      method: 'POST',
      body: formData,
    })

    isUpdating.value = false
    if (data) {
      emit('success', data)
      isOpen.value = false
    } else {
      emit('error', new Error('No data returned from action'))
      console.error('Error:', 'No data returned from action')
    }
  } catch (err) {
    isUpdating.value = false
    emit('error', err)
    console.error('Unexpected error:', err)
  }
}
</script>

