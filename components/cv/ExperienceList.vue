<template>
  <div class="personal-grid-wrapper"
       @mouseenter="isHovered = true"
       @mouseleave="isHovered = false">

    <v-btn v-if="isHovered"
           color="primary"
           class="my-1 neu-component-add-btn"
           size="small"
           variant="outlined"
           prepend-icon="mdi-plus"
           @click="add">
      neuer Eintrag
    </v-btn>

    <draggable
      v-model="localItems"
      item-key="id"
      handle=".drag"
      animation="150"
      class="exp-list"
      :force-fallback="true"
    >
      <template #item="{ element, index }">
        <div class="exp-item my-3">
          <div class="left" contenteditable @input="e=>onEdit(e, index, 'period')">{{ element.period }}</div>

          <div class="right">
            <div class="company" contenteditable @input="e=>onEdit(e, index, 'company')">{{ element.company }}</div>
            <div class="role" contenteditable @input="e=>onEdit(e, index, 'role')">{{ element.role }}</div>
            <ul>
              <li v-for="(b, bi) in element.bullets" :key="bi">
                <span contenteditable @input="e=>onBullet(e, index, bi)">{{ b }}</span>
              </li>
            </ul>
          </div>

          <div v-if="isHovered" class="actions">
            <v-icon @click="move(index,-1)">mdi-arrow-up</v-icon>
            <v-icon @click="move(index, 1)">mdi-arrow-down</v-icon>
            <v-icon color="error" @click="remove(index)">mdi-delete</v-icon>
            <!-- handle drag -->
            <v-icon class="drag" icon="mdi-dots-grid" />
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import { nanoid } from 'nanoid/non-secure'

const props = defineProps<{ modelValue: any[], accent?: string }>()
const emit = defineEmits(['update:modelValue'])

const isHovered = ref(false)

/** Liste réactive liée au parent */
const localItems = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

/** Mutations — toujours via localItems.value = ... */
function add(){
  localItems.value = [
    ...localItems.value,
    { id: nanoid(), period: 'MM/JJJJ - MM/JJJJ', company: 'Firma', role: 'Position', bullets: ['Aufgabe / Erfolg'] }
  ]
}
function remove(i:number){
  const list = [...localItems.value]
  list.splice(i,1)
  localItems.value = list
}
function move(i:number, dir:number){
  const list = [...localItems.value]
  const j = i+dir
  if (j<0 || j>=list.length) return
    ;[list[i],list[j]] = [list[j],list[i]]
  localItems.value = list
}
function onEdit(e: Event, idx:number, key:string){
  const list = [...localItems.value]
  list[idx] = { ...list[idx], [key]: (e.target as HTMLElement).innerText }
  localItems.value = list
}
function onBullet(e: Event, idx:number, bi:number){
  const list = [...localItems.value]
  const bullets = [...list[idx].bullets]
  bullets[bi] = (e.target as HTMLElement).innerText
  list[idx] = { ...list[idx], bullets }
  localItems.value = list
}
</script>

<style scoped>
.neu-component-add-btn {
  position: absolute;
  right: 5px;
}
.drag { cursor: grab; }

.exp-item{ display:grid; grid-template-columns: 220px 1fr auto; gap:12px; align-items:start; padding:12px; margin-bottom:10px; }
.left{ padding:6px 10px; border-bottom:3px solid var(--accent,#b88b6a); }
.company{ font-weight:800; }
.role{ opacity:.85; margin-bottom:4px; }
.actions{ display:flex; gap:6px; align-items:center; padding-top: 40px; }

/* handle drag : visible uniquement au hover de l'item */

.exp-item:hover .drag { opacity: 1; pointer-events: auto; }

/* éviter les drags parasites sur texte */
ul{ margin:0; padding-left:18px; }
[contenteditable]{ outline:none; border-radius:6px; -webkit-user-drag: none; }
[contenteditable]:focus{ box-shadow: inset 0 0 0 2px rgba(0,0,0,.15); }
</style>
