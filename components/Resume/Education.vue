<template>
  <div class="text-sm py-2">
    <v-row>
      <v-col cols="8" class="d-flex align-center">
        <p class="text-sm">{{ school }}</p>
      </v-col>
      <v-col cols="4" class="d-flex justify-end align-center">
        <p class="text-body-2 text-grey-darken-1 mb-0">{{ date }}</p>
      </v-col>
      <v-col cols="12">
        <p class="px-1 text-caption">{{ description }}</p>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  school: String,
  date: String,
  description: String,
});
</script>

<style scoped>

</style>
