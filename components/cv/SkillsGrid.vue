<template>
  <div class="personal-grid-wrapper"
       @mouseenter="isHovered = true"
       @mouseleave="isHovered = false">
    <div v-for="(group, gi) in modelValue" :key="group.id" class="skill-group my-3">
      <div class="label" contenteditable @input="e=>onEditGroup(e, gi)">
        {{ group.label }}
      </div>
      <div class="items">
        <template v-for="(s, si) in group.items" :key="si">
          <v-hover v-slot="{ isHovering, props }">
            <v-chip
              v-bind="props"
              class="ma-1 chip-hover-closable"
              :closable="isHovering"
              @click="openEditDialog(gi, si, s)"
              @click:close="remove(gi, si)"
            >
              {{ s }}
            </v-chip>
          </v-hover>
        </template>
        <v-btn v-if="isHovered"
               size="x-small"
               color="primary"
               variant="outlined"
               prepend-icon="mdi-plus"
               @click="add(gi)">
          neue Skillbox
        </v-btn>
      </div>
    </div>

    <!-- Dialog édition -->
    <v-dialog v-model="dialogVisible" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Skill bearbeiten</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editValue"
            label="Neuer Skill"
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

const props = defineProps<{ modelValue: { id:string, label:string, items:string[] }[] }>()
const emit = defineEmits(['update:modelValue'])
const update = (v:any)=>emit('update:modelValue',v)

const isHovered = ref(false)

// Dialog state
const dialogVisible = ref(false)
const editValue = ref('')
let editGroupIndex = -1
let editItemIndex = -1

function onEditGroup(e:Event, gi:number){
  const list=[...props.modelValue]
  list[gi] = { ...list[gi], label:(e.target as HTMLElement).innerText }
  update(list)
}

function add(gi:number){
  const list=[...props.modelValue]
  list[gi] = { ...list[gi], items:[...list[gi].items, 'Neuer Skill'] }
  update(list)
}

function remove(gi:number, si:number){
  const list=[...props.modelValue]
  const items=[...list[gi].items]
  items.splice(si,1)
  list[gi]={...list[gi], items}
  update(list)
}

// Ouvrir le dialog
function openEditDialog(gi:number, si:number, value:string){
  editGroupIndex = gi
  editItemIndex = si
  editValue.value = value
  dialogVisible.value = true
}

// Sauvegarder l'édition
function saveEdit(){
  if (editGroupIndex < 0 || editItemIndex < 0) return
  const list=[...props.modelValue]
  const items=[...list[editGroupIndex].items]
  items[editItemIndex] = editValue.value
  list[editGroupIndex] = { ...list[editGroupIndex], items }
  update(list)
  dialogVisible.value = false
}
</script>

<style scoped>
.skill-group{
  display:grid;
  grid-template-columns: 300px 1fr;
  gap:12px;
  align-items:center;
  margin-bottom:8px;
}
.label{
  font-weight:700;
  border-bottom:3px solid var(--accent,#b88b6a);
  padding-bottom:2px;
}
.items{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
}
[contenteditable]{
  outline:none;
  border-radius:6px;
}
[contenteditable]:focus{
  box-shadow: inset 0 0 0 2px rgba(0,0,0,.15);
}
</style>
