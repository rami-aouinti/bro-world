<template>
  <div class="langs-wrapper pa-4" :style="accent ? {'--accent': accent} : null"
       @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <v-btn v-if="isHovered && editable" class="neu-component-add-btn" size="small"
           variant="outlined" color="primary" prepend-icon="mdi-plus" @click="add">
      add language
    </v-btn>

    <draggable v-model="localItems" item-key="id" handle=".drag" animation="150"
               :force-fallback="true" class="langs" :disabled="!draggable">
      <template #item="{ element, index }">
        <div class="row">
          <div class="name">
            <span class="editable" :contenteditable="editable" spellcheck="false"
                  data-placeholder="Language name..."
                  @input="onEditText($event, index, 'name')">{{ element.name }}</span>
          </div>

          <div class="meter bars">
            <span v-for="n in maxLevel" :key="n" class="bar"
                  :class="{ on: n <= displayLevel(element) }"
                  :style="{ height: sizePx+'px' }"
                  @click="editable && setLevel(index, n)"/>
            <div class="actions" v-if="draggable || editable">
              <v-icon v-if="draggable" class="drag" icon="mdi-dots-grid" size="16" />
              <v-icon v-if="editable" color="error" icon="mdi-delete" size="16" @click="remove(index)" />
            </div>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
type Lang = { id:string; name:string; level:0|1|2|3|4|5; note?:string }

const props = withDefaults(defineProps<{
  modelValue: Lang[]
  accent?: string
  maxLevel?: number
  sizePx?: number
  editable?: boolean
  draggable?: boolean
}>(), { maxLevel: 5, sizePx: 18, editable: true, draggable: true })

const emit = defineEmits<{ (e:'update:modelValue', v: Lang[]): void }>()
const isHovered = ref(false)

const localItems = computed<Lang[]>({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
const displayLevel = (l: Lang) => l.level
function setLevel(i:number, lvl:number) {
  const list = [...localItems.value]
  list[i] = { ...list[i], level: (list[i].level===lvl?0:lvl) as Lang['level'] }
  localItems.value = list
}

function onEditText(e: Event, idx: number, key: 'name') {
  const text = (e.target as HTMLElement).innerText
  const list = [...localItems.value]
  list[idx] = { ...list[idx], [key]: text } as Lang
  localItems.value = list
}
function add(){ const id = crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
  localItems.value = [...localItems.value, { id, name:'Language', level:3 }] }
function remove(i:number){ const list=[...localItems.value]; list.splice(i,1); localItems.value=list }
</script>

<style scoped>
.langs-wrapper { position: relative; }
.neu-component-add-btn { position: absolute; top: 8px; right: 8px; z-index: 2; }
.langs { display: grid; gap: 10px; }
.row { display: grid; grid-template-columns: 120px 1fr; align-items: center; gap: 10px; padding: 6px 4px; border-radius: 10px; }
.name { font-weight: 700; min-width: 0; }
.meter { display: flex; align-items: center; gap: 6px; position: relative; }

.bars .bar { width: 10px; background: #d2d2d2; border-radius: 4px; display: inline-block; cursor: pointer; }
.bars .bar.on { background: var(--accent, #b88b6a); }

.actions { display: flex; gap: 3px; margin-left: 10px; opacity: 0; pointer-events: none; transition: opacity .12s ease; }
.row:hover .actions { opacity: 1; pointer-events: auto; }
.drag { cursor: grab; }

.editable { display: inline-block; min-width: 60px; padding: 2px 6px; border-radius: 6px; outline: none; }
.editable:focus { box-shadow: inset 0 0 0 2px rgba(0,0,0,.12); }
.editable:empty:before { content: attr(data-placeholder); color: rgba(0,0,0,.38); }
@media (max-width: 960px) { .row { grid-template-columns: 1fr; } }
</style>
