<template>
  <div class="interests-stacked pa-4">
    <div class="label">Hobbys</div>
    <ul class="items">
      <li v-for="(h,i) in modelValue" :key="i" class="item">
        <span class="dot" />
        <span class="text">{{ h }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string[] }>()
</script>

<style scoped>
.interests-stacked{ padding:4px 0 10px; border-bottom:3px solid var(--accent,#b88b6a); }
.label{ font-weight:700; margin-bottom:8px; }
.items{ list-style:none; padding:0; margin:0; }
.item{ display:flex; gap:10px; align-items:flex-start; padding:3px 0; }
.dot{ width:7px; height:7px; border-radius:50%; background:var(--accent,#b88b6a); margin-top:.5ex; }
.text{ line-height:1.35; }
</style>
