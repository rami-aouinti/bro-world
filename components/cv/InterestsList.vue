<template>
  <div class="interests"
       @mouseenter="isHovered = true"
       @mouseleave="isHovered = false">

    <div class="label">Hobbys</div>

    <div class="items">
      <template v-for="(h, i) in modelValue" :key="i">
        <v-hover v-slot="{ isHovering, props }">
          <v-chip
            v-bind="props"
            class="ma-1 chip-hover-closable"
            :closable="isHovering"
            @click="openEditDialog(i, h)"
            @click:close="remove(i)"
          >
            {{ h }}
          </v-chip>
        </v-hover>
      </template>

      <v-btn v-if="isHovered"
             size="x-small"
             color="primary"
             variant="outlined"
             prepend-icon="mdi-plus"
             @click="add">
        neuer Eintrag
      </v-btn>
    </div>

    <!-- Dialog édition -->
    <v-dialog v-model="dialogVisible" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Hobby bearbeiten</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editValue"
            label="Neues Hobby"
            outlined
            autofocus
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogVisible = false">Abbrechen</v-btn>
          <v-btn color="primary" @click="saveEdit">Speichern</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ modelValue: string[] }>()
const emit = defineEmits(['update:modelValue'])
const isHovered = ref(false)

const update = (v: string[]) => emit('update:modelValue', v)

// État pour le dialog
const dialogVisible = ref(false)
const editValue = ref('')
let editIndex = -1

function add() {
  update([ ...props.modelValue, 'Neues Hobby' ])
}

function remove(i: number) {
  const list = [...props.modelValue]
  list.splice(i, 1)
  update(list)
}

function openEditDialog(i: number, value: string) {
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
  transition: opacity .15s ease;
}
.chip-hover-closable:hover .v-chip__close {
  opacity: 1;
  pointer-events: auto;
}
</style>
