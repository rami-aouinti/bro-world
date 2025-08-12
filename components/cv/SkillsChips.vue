<template>
  <div class="skills-wrapper pa-4">
    <div
      class="skills-grid"
      :class="columns === 2 ? 'cols-2' : 'cols-1'"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div v-for="(group, gi) in modelValue" :key="group.id" class="skill-group">
        <div class="label-wrap">
          <div class="label" contenteditable @input="e=>onEditGroup(e, gi)">
            {{ group.label }}
          </div>
          <div
            v-if="groupLine === 'underline'"
            class="label-line"
            :style="lineStyle"
          />
        </div>

        <div class="items">
          <template v-for="(s, si) in group.items" :key="si">
            <v-hover v-slot="{ isHovering, props: hoverProps }">
              <v-chip
                v-bind="hoverProps"
                class="ma-1 chip-hover-closable"
                :closable="isHovering"
                :variant="chipVariant"
                :color="chipColor"
                :density="chipDensity"
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
            new skill
          </v-btn>
        </div>
      </div>
    </div>

    <v-dialog v-model="dialogVisible" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Skill edit</v-card-title>
        <v-card-text>
          <v-text-field v-model="editValue" label="New Skill" outlined autofocus />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogVisible = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveEdit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type SkillGroup = { id:string; label:string; items:string[] }

const props = withDefaults(defineProps<{
  modelValue: SkillGroup[]
  accent?: string
  chipVariant?: 'text' | 'elevated' | 'outlined' | 'flat' | 'tonal' | 'plain'
  chipColor?: string
  chipDensity?: 'comfortable' | 'compact' | 'default'
  columns?: 1|2
  groupLine?: 'underline' | 'none'
  groupLineWidth?: number
  groupLineStyle?: 'solid'|'dashed'|'dotted'
  groupLineColor?: string
}>(), {
  chipVariant: 'text',
  chipDensity: 'compact',
  columns: 2,
  groupLine: 'underline',
  groupLineWidth: 100,
  groupLineStyle: 'solid'
})

const emit = defineEmits(['update:modelValue'])
const update = (v:any)=>emit('update:modelValue',v)

// proxies
const chipVariant  = computed(() => props.chipVariant)
const chipColor    = computed(() => props.chipColor ?? props.accent)
const chipDensity  = computed(() => props.chipDensity)
const columns      = computed(() => props.columns ?? 2)

const groupLine      = computed(() => props.groupLine ?? 'underline')
const groupLineWidth = computed(() => props.groupLineWidth ?? 100)
const groupLineStyle = computed(() => props.groupLineStyle ?? 'solid')
const groupLineColor = computed(() => props.groupLineColor ?? (props.chipColor ?? props.accent))

const lineStyle = computed(() => ({
  width: (Math.max(0, Math.min(100, Number(groupLineWidth.value))) || 0) + '%',
  borderBottom: `3px ${groupLineStyle.value} ${groupLineColor.value || 'var(--accent, #b88b6a)'}`
}))

const isHovered = ref(false)
const dialogVisible = ref(false)
const editValue = ref(''); let editGroupIndex = -1; let editItemIndex = -1

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
function openEditDialog(gi:number, si:number, value:string){
  editGroupIndex = gi; editItemIndex = si; editValue.value = value; dialogVisible.value = true
}
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
.skills-wrapper{ position: relative; }
.skills-grid{
  display: grid;
  gap: 14px 16px;
}
.skills-grid.cols-1{ grid-template-columns: 1fr; }
.skills-grid.cols-2{ grid-template-columns: 1fr 1fr; }

.skill-group{
  width: 100%;
  display: grid;
  grid-template-rows: auto auto;
  gap: 8px;
}

.label-wrap{ display: grid; gap: 6px; }
.label{
  font-weight: 700;
  padding-bottom: 2px;
  outline: none; border-radius: 6px;
}
.label-line{
  height: 0; /* on dessine via border-bottom */
}
.items{ display:flex; flex-wrap:wrap; align-items:center; }
[contenteditable]:focus{ box-shadow: inset 0 0 0 2px rgba(0,0,0,.15); }
.chip-hover-closable .v-chip__close{ opacity:0; pointer-events:none; transition:opacity .15s ease; }
.chip-hover-closable:hover .v-chip__close{ opacity:1; pointer-events:auto; }
</style>
