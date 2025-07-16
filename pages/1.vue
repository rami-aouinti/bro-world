<template>
  <div>
    <Simple v-if="decodedData" :acc="decodedData" />
    <div
      v-else
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <Loading class="h-5 w-5" />
    </div>
  </div>
</template>
<script setup>
import { decodeData } from "../utils/transformer";
import Simple from "~/components/Job/Resume/Simple.vue";
import Loading from "~/components/Job/Resume/Loading.vue";
const route = useRoute();
const acc = route.query.data;
const decodedData = ref({});
decodedData.value = decodeData(acc);
</script>
<style scoped></style>
