<template>
  <div class="break-page">
    <Simple v-if="decodedData" :acc="decodedData" />
    <div
      v-else
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <Loading class="h-5 w-5" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import Simple from "~/components/Job/Resume/Simple.vue";

definePageMeta({
  layout: 'empty'
})
import { decodeData } from "~/utils/transformer";
import Loading from "~/components/Job/Resume/Loading.vue";
const route = useRoute();
const acc = route.query.data;
const decodedData = ref({});
decodedData.value = decodeData(acc);
</script>
<style scoped>
@media print {
  @page {
    size: A4;
    margin: 1cm 0 1cm 0;
  }

  @page:first {
    margin-top: 0cm;
  }

  html, body {
    height: auto;
  }
}

</style>
