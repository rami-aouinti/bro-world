<script lang="ts" setup>
import type { ShopifyCollections } from "~/modules/shopify/types";

const props = defineProps<{ collections?: ShopifyCollections }>();
const route = useRoute();

function isActiveCollection(collectionHandle: string) {
  return route.params.handle === collectionHandle;
}

const selectOptions = computed(() =>
  props.collections?.edges.map(({ node }) => ({
    value: node.title,
    to: node.handle,
  }))
);

const selected = ref(
  selectOptions.value?.find(option => option.to === route.params.handle)?.value
);
</script>

<template>
  <aside>
    <!-- Mobile select -->
    <v-select
      v-model="selected"
      rounded="xl"
      :items="selectOptions"
      item-title="value"
      item-value="value"
      class="mobile-only mb-1 mx-3"
      variant="outlined"
      @update:modelValue="val => {
        const target = selectOptions.find(opt => opt.value === val);
        if (target) navigateTo(`/ecommerce/collection/${target.to}`);
      }"
    />

    <!-- Desktop list -->
    <div class="desktop-only">
      <v-list lines="one" class="rounded-xl bg-transparent">
        <v-list-item
          v-for="{ node } in collections?.edges"
          :key="node.handle"
          :to="`/ecommerce/collection/${node.handle}`"
          link
          density="compact"
          :active="isActiveCollection(node.handle)"
          rounded="xl"
          class="bg-transparent mx-3"
          :class="{ 'active-item': isActiveCollection(node.handle) }"
        >
          <v-list-item-title>{{ node.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>

  </aside>
</template>

<style scoped>
/* Responsive visibility */
.mobile-only {
  display: block;
}

.desktop-only {
  display: none;
}

@media (min-width: 1024px) {
  .mobile-only {
    display: none;
  }

  .desktop-only {
    display: block;
  }
}

.active-item {
  background-color: rgb(var(--v-theme-primary));
  font-weight: 600;
  color: #222;
  box-shadow: 0 3px 8px rgb(var(--v-theme-primary));
}

.v-list-item {
  transition: background-color 0.2s, transform 0.2s;
}

.v-list-item:hover {
  background-color: rgb(var(--v-theme-primary));
  transform: translateX(2px);
}
</style>
