<template>
  <NuxtImg
    :width="size"
    :height="size"
    class="border border-radius-xl border-secondary border-md shadow-2xl shadow-primary rounded-circle object-cover"
    :alt="props.user?.username"
    :src="props.user?.photo ?? '/img/person.png'"
    :lazy-src="'/img/person.png'"
    format="webp"
    loading="lazy"
  >
  </NuxtImg>
</template>

<script lang="ts" setup>
const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  size: {
    type: [String, Number],
    default: 40
  },
  color: {
    type: String,
    default: 'primary'
  }
})
</script>
