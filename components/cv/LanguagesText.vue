<template>
  <div
    class="langs-wrapper pa-4"
    :style="accent ? {'--accent': accent} : null"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <v-btn
      v-if="isHovered && editable"
      class="neu-component-add-btn"
      size="small"
      variant="outlined"
      color="primary"
      prepend-icon="mdi-plus"
      @click="add"
    >
      add language
    </v-btn>

    <draggable
      v-model="localItems"
      item-key="id"
      handle=".drag"
      animation="150"
      :force-fallback="true"
      class="langs"
      :disabled="!draggable"
    >
      <template #item="{ element, index }">
        <div class="row">
          <div class="name">
            <span
              class="editable"
              :contenteditable="editable"
              spellcheck="false"
              data-placeholder="Language name..."
              @input="onEditText($event, index, 'name')"
            >{{ element.name }}</span>
          </div>

          <div class="stars">
            <svg
              v-for="i in maxLevel"
              :key="i"
              viewBox="0 0 24 24"
              class="star clickable"
              :style="{ width: sizePx+'px', height: sizePx+'px' }"
              :class="{ on: i <= displayLevel(element) }"
              @click="editable && toggleLevel(index, i)"
              @mouseenter="setHover(element.id, i)"
              @mouseleave="clearHover(element.id)"
              role="button"
              tabindex="0"
              @keydown.enter.prevent="editable && toggleLevel(index, i)"
              @keydown.space.prevent="editable && toggleLevel(index, i)"
            >
              <path d="M12 2.5 14.9 9l7.1.6-5.4 4.4 1.8 6.9L12 17.7 5.6 20.9l1.8-6.9-5.4-4.4L9.1 9 12 2.5Z"/>
            </svg>

            <span class="note">
              <span
                class="editable"
                :contenteditable="editable"
                spellcheck="false"
                data-placeholder="Note..."
                @input="onEditText($event, index, 'note')"
              >{{ element.note ?? '' }}</span>
            </span>

            <div class="actions" v-if="draggable || editable">
              <v-tooltip text="Drag" v-if="draggable">
                <template #activator="{ props }">
                  <v-icon v-bind="props" class="drag" icon="mdi-dots-grid" size="16" />
                </template>
              </v-tooltip>

              <v-tooltip text="Delete" v-if="editable">
                <template #activator="{ props }">
                  <v-icon v-bind="props" color="error" icon="mdi-delete" size="16" @click="remove(index)" />
                </template>
              </v-tooltip>
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

type Lang = { id: string; name: string; level: 0|1|2|3|4|5; note?: string }

const props = withDefaults(defineProps<{
  modelValue: Lang[]
  accent?: string
  maxLevel?: number
  sizePx?: number
  editable?: boolean
  draggable?: boolean
}>(), {
  maxLevel: 5,
  sizePx: 18,
  editable: true,
  draggable: true,
})

const emit = defineEmits<{ (e:'update:modelValue', v: Lang[]): void }>()
const isHovered = ref(false)

const localItems = computed<Lang[]>({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const hoverLevel = ref<Record<string, number | null>>({})
const setHover = (id: string, lvl: number) => { hoverLevel.value = { ...hoverLevel.value, [id]: lvl } }
const clearHover = (id: string) => { hoverLevel.value = { ...hoverLevel.value, [id]: null } }
const displayLevel = (l: Lang) => hoverLevel.value[l.id] ?? l.level

function toggleLevel(index: number, i: number) {
  const list = [...localItems.value]
  const lvl = list[index].level === i ? 0 : i
  list[index] = { ...list[index], level: lvl as Lang['level'] }
  localItems.value = list
}

function onEditText(e: Event, idx: number, key: 'name' | 'note') {
  const text = (e.target as HTMLElement).innerText
  const list = [...localItems.value]
  list[idx] = { ...list[idx], [key]: text } as Lang
  localItems.value = list
}

function add() {
  const id = (globalThis.crypto?.randomUUID?.() ?? `l-${Math.random().toString(36).slice(2)}`)
  localItems.value = [...localItems.value, { id, name: 'Language', level: 3, note: '' }]
}
function remove(i: number) {
  const list = [...localItems.value]
  list.splice(i, 1)
  localItems.value = list
}
</script>

<style scoped>
.langs-wrapper { position: relative; }
.neu-component-add-btn { position: absolute; top: 8px; right: 8px; z-index: 2; }
.langs { display: grid; gap: 10px; }
.row { display: grid; grid-template-columns: 120px 1fr; align-items: center; gap: 10px; padding: 6px 4px; border-radius: 10px; }
.name { font-weight: 700; min-width: 0; }
.stars { display: flex; align-items: center; gap: 6px; position: relative; }

.star { fill: #d2d2d2; transition: transform .08s ease; }
.star.on { fill: var(--accent, #b88b6a); }
.clickable { cursor: pointer; }
.clickable:hover { transform: scale(1.1); }

.note { margin-left: 6px; opacity: .8; font-size: .95em; }
.actions { display: flex; gap: 3px; margin-left: 10px; opacity: 0; pointer-events: none; transition: opacity .12s ease; }
.row:hover .actions { opacity: 1; pointer-events: auto; }
.drag { cursor: grab; }

.editable { display: inline-block; min-width: 60px; padding: 2px 6px; border-radius: 6px; outline: none; }
.editable:focus { box-shadow: inset 0 0 0 2px rgba(0,0,0,.12); }
.editable:empty:before { content: attr(data-placeholder); color: rgba(0,0,0,.38); }

@media (max-width: 960px) { .row { grid-template-columns: 1fr; } }
</style>
