<script lang="ts" setup>
import { ShopifyCollectionSortKeys } from "~/modules/shopify/types";

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
const search = ref('')
const router = useRouter();
const route = useRoute();

const options = [
  { label: "Relevance", value: ShopifyCollectionSortKeys.RELEVANCE },
  { label: "Title", value: ShopifyCollectionSortKeys.TITLE },
  { label: "Price", value: ShopifyCollectionSortKeys.PRICE },
  { label: "Best Selling", value: ShopifyCollectionSortKeys.BEST_SELLING },
  { label: "Created", value: ShopifyCollectionSortKeys.CREATED },
];
const sales = [
  { label: "10%", value: ShopifyCollectionSortKeys.RELEVANCE },
  { label: "20%", value: ShopifyCollectionSortKeys.TITLE },
  { label: "30%", value: ShopifyCollectionSortKeys.PRICE },
  { label: "40%", value: ShopifyCollectionSortKeys.BEST_SELLING },
  { label: "50%", value: ShopifyCollectionSortKeys.CREATED },
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
  <v-text-field
    v-model="search"
    prepend-inner-icon="mdi-magnify"
    label="Search"
    single-line
    hide-details
    class="mx-1"
    density="compact"
    rounded="xl"
    variant="outlined"
    style="max-width: 300px; margin-bottom: 20px;"
  />
  <v-select
    rounded="xl"
    v-model="selected"
    :items="sales"
    max-width="200"
    class="mx-1"
    item-title="label"
    item-value="value"
    :disabled="disabled"
    variant="outlined"
    density="compact"
    aria-label="Sort products"
  />
  <v-select
    rounded="xl"
    v-model="selected"
    :items="options"
    max-width="200"
    class="mx-1"
    item-title="label"
    item-value="value"
    :disabled="disabled"
    variant="outlined"
    density="compact"
    aria-label="Sort products"
  />
</template>

<style scoped>
/* tu peux ajouter ici des styles spécifiques si besoin */
</style>
