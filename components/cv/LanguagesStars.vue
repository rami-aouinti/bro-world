<template>
  <div class="langs">
    <div v-for="l in modelValue" :key="l.id" class="row">
      <div class="name">{{ l.name }}</div>
      <div class="stars">
        <svg v-for="i in 5" :key="i" viewBox="0 0 24 24" class="star" :class="{ on: i <= l.level }">
          <path d="M12 2.5 14.9 9l7.1.6-5.4 4.4 1.8 6.9L12 17.7 5.6 20.9l1.8-6.9-5.4-4.4L9.1 9 12 2.5Z"/>
        </svg>
        <span v-if="l.note" class="note">{{ l.note }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Lang = { id:string; name:string; level:0|1|2|3|4|5; note?:string }
defineProps<{ modelValue: Lang[] }>()
</script>

<style scoped>
.langs{ display:grid; gap:10px; }
.row{ display:grid; grid-template-columns: 220px 1fr; align-items:center; gap:10px; }
.name{ font-weight:700; }
.stars{ display:flex; align-items:center; gap:6px; }
.star{ width:18px; height:18px; fill:#d2d2d2; }
.star.on{ fill:var(--accent,#b88b6a); }
.note{ margin-left:6px; opacity:.75; font-size:.95em; }
</style>
