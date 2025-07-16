<template>
  <v-card
    border="xl"
    class="mx-auto overflow-y-auto"
    max-height="500"
    max-width="850"
    rounded="xl"
    variant="text"
  >
    <Simple :acc="data" />
  </v-card>
</template>
<script lang="ts" setup>
import Simple from "~/components/Job/Resume/Simple.vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>
<style scoped></style>
