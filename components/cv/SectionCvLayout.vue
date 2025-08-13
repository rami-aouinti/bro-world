<template>
  <div v-if="section">
    <v-item-group
      v-model="local"
      mandatory
      @update:modelValue="val => {
        emit('update:modelValue', val)
        emit('action', props.sectionKey, val)
      }"
    >
      <div class="d-flex">
        <v-item
          v-for="a in (section.actions || [])"
          :key="a.key"
          :value="a.key"
          v-slot="{ isSelected, toggle }"
        >
          <v-btn
            class="ma-1 text-none"
            :class="isSelected ? 'border border-radius-xl border-secondary border-md shadow-2xl shadow-primary'
                               : 'border border-radius-xl border-secondary border-md'"
            :variant="isSelected ? 'elevated' : 'text'"
            size="small"
            rounded="lg"
            @click="toggle"
          >
            <v-icon v-if="a.icon" start :icon="a.icon" />
            {{ a.label ?? a.key }}
          </v-btn>
        </v-item>
      </div>
    </v-item-group>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'

type Action = { key: string; label?: string; icon?: string }
type Section = { key: string; label: string; icon?: string; actions: Action[] }

const props = defineProps<{
  sectionKey: string
  sectionModels: Section[]
  modelValue?: string | null
}>()

const emit = defineEmits<{
  (e:'update:modelValue', v:string): void
  (e:'action', sectionKey:string, actionKey:string): void
}>()

const section = computed(() => props.sectionModels.find(s => s.key === props.sectionKey) || null)
const local   = ref<string | null>(props.modelValue ?? null)

watch(() => props.modelValue, (v) => { local.value = v ?? null })

// si rien n'est choisi → prendre la 1ère action de la section
watch(section, async (def) => {
  if (!def) return
  const actions = def.actions || []
  if (!local.value || !actions.some(a => a.key === local.value)) {
    const first = actions[0]?.key
    if (first) {
      await nextTick()
      local.value = first
      emit('update:modelValue', first)
      emit('action', props.sectionKey, first)
    }
  }
}, { immediate: true })
</script>
