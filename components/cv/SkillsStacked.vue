<template>
  <div class="skills-stacked pa-4">
    <div v-for="g in modelValue" :key="g.id" class="group">
      <div class="label">{{ g.label }}</div>
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
type Group = { id:string; label:string; items:string[] }
defineProps<{ modelValue: Group[] }>()
</script>

<style scoped>
.skills-stacked{ display:grid; gap:14px; }
.group{ padding:4px 0 10px; border-bottom:3px solid var(--accent,#b88b6a); }
.label{ font-weight:700; margin-bottom:8px; }
.items{ list-style:none; padding:0; margin:0; }
.item{ display:flex; gap:10px; align-items:flex-start; padding:3px 0; }
.dot{ width:7px; height:7px; border-radius:50%; background:var(--accent,#b88b6a); margin-top:.5ex; }
.text{ line-height:1.35; }
</style>
