<!-- components/TemplatePicker.vue -->
<template>
  <v-slide-group
    v-model="internalValue"
    direction="vertical"
    center-active
    :show-arrows="false"
    style="max-height: 530px; max-width: 95px; overflow-x: hidden; position: absolute; top: 75px; margin-left: -20px"
    class="template-picker d-flex justify-center align-center"
  >
  <v-slide-group-item
    v-for="p in presets"
    :key="p.key"
    :value="p.key"
    v-slot="{ isSelected, toggle }"
  >
    <v-card
      class="my-2 cursor-pointer"
      :elevation="isSelected ? 24 : 2"
      :class="isSelected ? 'border border-radius-xl border-secondary border-md shadow-2xl shadow-primary' : ''"
      width="95"
      role="button"
      tabindex="0"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <v-img
        :src="p.previewImg"
        :alt="p.label"
        height="130"
        cover
        class="rounded-t"
      />
    </v-card>
  </v-slide-group-item>
  </v-slide-group>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Preset { key: string; label: string; previewImg: string }

const props = defineProps<{
  modelValue: string | null
  presets: Preset[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

const internalValue = computed({
  get: () => props.modelValue ?? '',
  set: (v: string) => emit('update:modelValue', v),
})
</script>

<style scoped>
.ring { outline: 2px solid var(--v-theme-primary); }
.cursor-pointer { cursor: pointer; }
.template-picker .v-slide-group__prev,
.template-picker .v-slide-group__next {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 24px;
}

.template-picker .v-slide-group__prev {
  top: 0;
}

.template-picker .v-slide-group__next {
  bottom: 0;
}
</style>
