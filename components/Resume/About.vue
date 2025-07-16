<template>
  <v-col cols="12" md="12">
    <p class="px-1 text-caption">{{ description }}</p>
  </v-col>
</template>

<script lang="ts" setup>
const props = defineProps({
  description: String
});
</script>

<style scoped>

</style>
