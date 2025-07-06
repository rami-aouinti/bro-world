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
          <v-btn :color="btn.color || 'grey'" @click="handleAction(btn.action)">
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

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success', result: any): void
  (e: 'error', err: any): void
}>()

const isUpdating = ref(false)
const autoUpdate = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

const handleAction = async (action: string | (() => void)) => {
  // 👉 Cas fonction personnalisée
  if (typeof action === 'function') {
    try {
      action()
    } catch (err) {
      console.error('[BaseDialog] Erreur dans la fonction personnalisée :', err)
    }
    return
  }

  // 👉 Cas d'action spéciale : 'close'
  if (action === 'close') {
    isOpen.value = false
    return
  }

  // 👉 Cas d'appel API
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

    const result = await $fetch(action, {
      method: 'POST',
      body: formData,
    })

    emit('success', result)
    isOpen.value = false
  } catch (err) {
    emit('error', err)
    console.error('[BaseDialog] Unexpected error:', err)
  } finally {
    isUpdating.value = false
  }
}
</script>
