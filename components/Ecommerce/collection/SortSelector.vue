<script lang="ts" setup>
import { ShopifyCollectionSortKeys } from "~/modules/shopify/types";

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();
const route = useRoute();

const options = [
  { label: "Relevance", value: ShopifyCollectionSortKeys.RELEVANCE },
  { label: "Title", value: ShopifyCollectionSortKeys.TITLE },
  { label: "Price", value: ShopifyCollectionSortKeys.PRICE },
  { label: "Best Selling", value: ShopifyCollectionSortKeys.BEST_SELLING },
  { label: "Created", value: ShopifyCollectionSortKeys.CREATED },
];

const selected = ref(
  route.query.sortKey
    ? options.find(option => option.value === route.query.sortKey)?.value
    : options[0]?.value
);

watch(selected, (newSortKey) => {
  if (!newSortKey) return;
  router.replace({ query: { sortKey: newSortKey } });
});
</script>

<template>
  <v-select
    v-model="selected"
    :items="options"
    item-title="label"
    item-value="value"
    :disabled="disabled"
    variant="outlined"
    density="compact"
    class="w-full"
    aria-label="Sort products"
  />
</template>

<style scoped>
/* tu peux ajouter ici des styles spécifiques si besoin */
</style>
