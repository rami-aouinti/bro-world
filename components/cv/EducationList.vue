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

    <draggable v-model="localItems"
               item-key="id"
               class="edu-list"
               handle=".drag"
               animation="150" :force-fallback="true">
      <template #item="{ element, index }">
        <div class="edu-item">
          <div class="left"
               contenteditable
               @input="onEdit($event, index, 'period')">
            {{ element.period }}
          </div>
          <div class="right">
            <div class="school"
                 contenteditable
                 @input="onEdit($event, index, 'school')">
              {{ element.school }}
            </div>
            <div class="degree"
                 contenteditable
                 @input="onEdit($event, index, 'degree')">
              {{ element.degree }}
            </div>
            <ul>
              <li v-for="(b, bi) in element.bullets" :key="bi">
                <span contenteditable @input="onBullet($event, index, bi)">{{ b }}</span>
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
import { nanoid } from 'nanoid/non-secure'
import draggable from 'vuedraggable'

const props = defineProps<{ modelValue: any[], accent?: string }>()
const emit = defineEmits(['update:modelValue'])

const isHovered = ref(false)

const localItems = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function add() {
  localItems.value = [
    ...localItems.value,
    {
      id: nanoid(),
      period: 'JJJJ - JJJJ',
      school: 'Universität',
      degree: 'Studium',
      bullets: ['Schwerpunkte ...']
    }
  ]
}

function remove(i: number) {
  const list = [...localItems.value]
  list.splice(i, 1)
  localItems.value = list
}

function move(i: number, dir: number) {
  const list = [...localItems.value]
  const j = i + dir
  if (j < 0 || j >= list.length) return
    ;[list[i], list[j]] = [list[j], list[i]]
  localItems.value = list
}

function onEdit(e: Event, idx: number, key: string) {
  const list = [...localItems.value]
  list[idx] = { ...list[idx], [key]: (e.target as HTMLElement).innerText }
  localItems.value = list
}

function onBullet(e: Event, idx: number, bi: number) {
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
.edu-item {
  display: grid;
  grid-template-columns: 220px 1fr auto;
  gap: 12px;
  align-items: start;
  padding: 12px;
  margin: 10px;
}
.left {
  padding: 6px 10px;
  border-bottom: 3px solid var(--accent,#b88b6a);
}
.school {
  font-weight: 800;
}
.degree {
  opacity: .85;
  margin-bottom: 4px;
}
.actions{ display:flex; gap:6px; align-items:center; padding-top: 40px; }
[contenteditable] {
  outline: none;
  border-radius: 6px;
}
[contenteditable]:focus {
  box-shadow: inset 0 0 0 2px rgba(0,0,0,.15);
}
ul{ margin:0; padding-left:18px; }
[contenteditable]{ outline:none; border-radius:6px; -webkit-user-drag: none; }
[contenteditable]:focus{ box-shadow: inset 0 0 0 2px rgba(0,0,0,.15); }
</style>
