<template>
  <div
    class="interests"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="label">Hobbies</div>

    <div class="items">
      <template v-for="(h, i) in modelValue" :key="i">
        <v-hover v-slot="{ isHovering, props: hoverProps }">
          <v-chip
            v-bind="hoverProps"
            class="ma-1 chip-hover-closable"
            :closable="isHovering"
            :variant="chipVariant"
            @click="openEditDialog(h, i)"
            @click:close="remove(i)"
          >
            {{ h }}
          </v-chip>
        </v-hover>
      </template>

      <v-btn
        v-if="isHovered"
        size="x-small"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-plus"
        @click="add"
      >
        Neues Hobby
      </v-btn>
    </div>

    <v-dialog v-model="dialogVisible" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Hobby edit</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editValue"
            label="New Hobby"
            variant="outlined"
            autofocus
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogVisible = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveEdit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    chipVariant?: 'text' | 'elevated' | 'outlined' | 'flat' | 'tonal' | 'plain'
  }>(),
  { chipVariant: 'text' }
)

// évite le conflit avec le `props` du slot
const chipVariant = computed(() => props.chipVariant)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const isHovered = ref(false)
const dialogVisible = ref(false)
const editValue = ref('')
let editIndex = -1

const update = (v: string[]) => emit('update:modelValue', v)

function add() {
  update([...props.modelValue, 'Neues Hobby'])
}

function remove(i: number) {
  const list = [...props.modelValue]
  list.splice(i, 1)
  update(list)
}

function openEditDialog(value: string, i: number) {
  editIndex = i
  editValue.value = value
  dialogVisible.value = true
}

function saveEdit() {
  if (editIndex < 0) return
  const list = [...props.modelValue]
  list[editIndex] = editValue.value
  update(list)
  dialogVisible.value = false
  editIndex = -1
}
</script>

<style scoped>
.interests {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 12px;
  align-items: center;
}
.label {
  font-weight: 700;
  border-bottom: 3px solid var(--accent, #b88b6a);
  padding-bottom: 2px;
}
.items {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.chip-hover-closable .v-chip__close {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}
.chip-hover-closable:hover .v-chip__close {
  opacity: 1;
  pointer-events: auto;
}
</style>
