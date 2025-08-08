<script setup lang="ts">
const emit = defineEmits(['select'])
const props = defineProps<{ selectedReact: string }>()
const reactions = [
  { name: 'like', icon: '👍', label: 'Like' },
  { name: 'love', icon: '❤️', label: 'Love' },
  { name: 'haha', icon: '😂', label: 'Haha' },
  { name: 'wow', icon: '😮', label: 'Wow' },
  { name: 'sad', icon: '😢', label: 'Sad' },
  { name: 'angry', icon: '😡', label: 'Angry' }
]

function selectReaction(r: string) {
  emit('select', r)
}
</script>

<template>
  <div class="reaction-menu">
    <div
      v-for="r in reactions"
      :key="r.name"
      :class="props.selectedReact === r.name ? 'reaction-item-selected' : 'reaction-item'"
      :title="r.label"
      @click="selectReaction(r.name)"
    >
      {{ r.icon }}
    </div>
  </div>
</template>

<style scoped>
.reaction-menu {
  display: flex;
  background: transparent;
  border-radius: 30px;
  padding: 6px 10px;
  gap: 8px;
}
.reaction-item {
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.reaction-item-selected {
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  transform: scale(1.4);
}
.reaction-item:hover {
  transform: scale(1.4);
}
</style>
