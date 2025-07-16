<template>
  <div class="d-flex align-center justify-space-between fixed-skill-line py-2">
    <span class="text-body-2">{{ label }}</span>
    <div class="d-flex">
      <span
        v-for="i in max"
        :key="i"
        class="star-icon"
        v-html="getStar(i)"
      ></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  label: String,
  stars: Number,
  max: {
    type: Number,
    default: 5
  }
});

const filledStar = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gold" viewBox="0 0 24 24">
  <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.62 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z"/>
</svg>`;

const outlinedStar = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="grey" viewBox="0 0 24 24">
  <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24zM12 15.4
    l-3.76 2.27 1-4.28L5.92 10.5l4.38-.38L12 6.1l1.71 4.02 4.38.38-3.32 2.89 1 4.28L12 15.4z"/>
</svg>`;

const getStar = (index: number) => {
  return index <= props.stars ? filledStar : outlinedStar;
};
</script>

<style scoped>
.star-icon {
  display: inline-block;
  margin-left: 2px;
}
</style>
