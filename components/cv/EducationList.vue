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
      new education
    </v-btn>

    <draggable
      v-model="localItems"
      item-key="id"
      class="edu-list"
      handle=".drag"
      animation="150"
      :force-fallback="true"
    >
      <template #item="{ element, index }">
        <div class="edu-item" :class="variantClass">
          <!-- période -->
          <div class="left">
            <span
              class="period"
              :style="dateLineTextStyle"
              contenteditable
              @input="onEdit($event, index, 'period')"
            >
              {{ element.period }}
            </span>
            <span v-if="hasFixedLine" class="period-line" :style="fixedLineStyle" />
          </div>

          <!-- contenu -->
          <div class="right">
            <div class="school" contenteditable @input="onEdit($event, index, 'school')">
              {{ element.school }}
            </div>
            <div class="degree" contenteditable @input="onEdit($event, index, 'degree')">
              {{ element.degree }}
            </div>
            <ul>
              <li v-for="(b, bi) in element.bullets" :key="bi">
                <span contenteditable @input="onBullet($event, index, bi)">{{ b }}</span>
              </li>
            </ul>
          </div>

          <!-- actions -->
          <div v-if="isHovered" class="actions">
            <v-icon size="12" @click="move(index,-1)">mdi-arrow-up</v-icon>
            <v-icon size="12" @click="move(index, 1)">mdi-arrow-down</v-icon>
            <v-icon size="12" color="error" @click="remove(index)">mdi-delete</v-icon>
            <v-icon size="12" class="drag" icon="mdi-dots-grid" />
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

type EduItem = {
  id: string
  period: string
  school: string
  degree: string
  bullets: string[]
}
type DateLineCfg = {
  enabled?: boolean
  color?: string
  widthPx?: number
  style?: 'solid'|'dashed'|'dotted'
  marginBottomPx?: number
  fullWidth?: boolean
  lineLengthPx?: number     // ✅ longueur fixe
}

const props = withDefaults(defineProps<{
  modelValue: EduItem[]
  accent?: string
  variant?: 'two-col' | 'stacked'
  dateLine?: DateLineCfg
}>(), {
  variant: 'two-col',
  dateLine: () => ({
    enabled: true,
    color: undefined,
    widthPx: 3,
    style: 'solid',
    marginBottomPx: 0,
    fullWidth: false,
    lineLengthPx: undefined,
  })
})

const emit = defineEmits(['update:modelValue'])
const isHovered = ref(false)

const localItems = computed<EduItem[]>({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const variantClass = computed(() =>
  props.variant === 'stacked' ? 'variant--stacked' : 'variant--two-col'
)

const hasFixedLine = computed(() => {
  const len = props.dateLine?.lineLengthPx
  return props.dateLine?.enabled !== false && Number.isFinite(len as number)
})
const dateLineTextStyle = computed(() => {
  const cfg = props.dateLine || {}
  const disp = cfg.fullWidth ? 'block' : 'inline-block'
  const mb   = (cfg.marginBottomPx ?? 0) + 'px'

  if (cfg.enabled === false) {
    return { borderBottom: 'none', display: disp, marginBottom: mb }
  }
  if (Number.isFinite(cfg.lineLengthPx as number)) {
    return { borderBottom: 'none', display: disp, marginBottom: 0 }
  }
  const color = cfg.color || 'var(--accent,#b88b6a)'
  const width = (cfg.widthPx ?? 3) + 'px'
  const style = cfg.style ?? 'solid'
  return {
    borderBottom: `${width} ${style} ${color}`,
    display: disp,
    paddingBottom: '4px',
    marginBottom: mb,
  }
})
const fixedLineStyle = computed(() => {
  const cfg = props.dateLine || {}
  const color = cfg.color || 'var(--accent,#b88b6a)'
  const height = (cfg.widthPx ?? 3) + 'px'
  const style = cfg.style ?? 'solid'
  const len = (cfg.lineLengthPx as number) ?? 80
  const mb  = (cfg.marginBottomPx ?? 0) + 'px'
  return {
    width: `${len}px`,
    height: 0,
    borderBottom: `${height} ${style} ${color}`,
    display: 'block',
    marginTop: '2px',
    marginBottom: mb,
  }
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
function onEdit(e: Event, idx: number, key: 'period'|'school'|'degree') {
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
.personal-grid-wrapper { position: relative; }
.neu-component-add-btn { position: absolute; right: 5px; top: -6px; }
.drag { cursor: grab; }

.edu-item{
  display: grid;
  gap: 12px;
  align-items: start;
  padding: 12px;
  margin: 10px 0;
  grid-template-areas: "left right actions";
}

/* two-col */
.variant--two-col{ grid-template-columns: 120px 1fr auto; }
.variant--two-col .left{ grid-area:left; }
.variant--two-col .right{ grid-area:right; }
.variant--two-col .actions{ grid-area:actions; display:flex; gap:6px; align-self:start; padding-top:40px; }

/* stacked */
.variant--stacked{
  grid-template-columns: 1fr;
  grid-template-areas: "left" "right" "actions";
}
.variant--stacked .left{ grid-area:left; }
.variant--stacked .right{ grid-area:right; }
.variant--stacked .actions{ grid-area:actions; display:flex; gap:6px; justify-content:flex-start; padding-top:6px; }

.school { font-weight: 800; }
.degree { opacity: .85; margin-bottom: 4px; }

.left .period{ outline:none; border-radius:4px; }
.left .period:focus{ box-shadow: inset 0 0 0 2px rgba(0,0,0,.1); }

ul{ margin:0; padding-left:18px; }
[contenteditable]{ -webkit-user-drag: none; }

.edu-item .drag { opacity: 0; pointer-events: none; transition: opacity .12s; }
.edu-item:hover .drag { opacity: 1; pointer-events: auto; }

@media (max-width: 960px) {
  .variant--two-col{
    grid-template-columns: 1fr;
    grid-template-areas: "left" "right" "actions";
  }
  .variant--two-col .actions{ padding-top:6px; }
}
</style>
