<template>
  <div class="skills-stacked pa-4" :class="columns === 2 ? 'cols-2' : 'cols-1'">
    <div v-for="g in modelValue" :key="g.id" class="group">
      <div class="label-wrap">
        <div class="label">{{ g.label }}</div>
        <div v-if="groupLine === 'underline'" class="label-line" :style="lineStyle" />
      </div>

      <ul class="items">
        <li v-for="(it,i) in g.items" :key="i" class="item">
          <span class="dot" />
          <span class="text">{{ it }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
type Group = { id:string; label:string; items:string[] }

const props = withDefaults(defineProps<{
  modelValue: Group[]
  columns?: 1|2
  groupLine?: 'underline'|'none'
  groupLineWidth?: number
  groupLineStyle?: 'solid'|'dashed'|'dotted'
  groupLineColor?: string
  accent?: string
}>(), {
  columns: 1,
  groupLine: 'underline',
  groupLineWidth: 100,
  groupLineStyle: 'solid'
})

const columns      = computed(() => props.columns ?? 1)
const groupLine    = computed(() => props.groupLine ?? 'underline')
const lineStyle = computed(() => ({
  width: (Math.max(0, Math.min(100, Number(props.groupLineWidth))) || 0) + '%',
  borderBottom: `3px ${props.groupLineStyle} ${props.groupLineColor || 'var(--accent, #b88b6a)'}`
}))
</script>

<style scoped>
.skills-stacked{
  display:grid; gap:14px 16px;
}
.skills-stacked.cols-1{ grid-template-columns: 1fr; }
.skills-stacked.cols-2{ grid-template-columns: 1fr 1fr; }

.group{ padding:4px 0 10px; }
.label-wrap{ display:grid; gap:6px; }
.label{ font-weight:700; }
.label-line{ height:0; }

.items{ list-style:none; padding:0; margin:6px 0 0; }
.item{ display:flex; gap:10px; align-items:flex-start; padding:3px 0; }
.dot{ width:7px; height:7px; border-radius:50%; background:var(--accent,#b88b6a); margin-top:.5ex; }
.text{ line-height:1.35; }
</style>
