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
      :items="selectOptions"
      item-title="value"
      item-value="value"
      class="mobile-only mb-4"
      variant="outlined"
      @update:modelValue="val => {
        const target = selectOptions.find(opt => opt.value === val);
        if (target) navigateTo(`/ecommerce/collection/${target.to}`);
      }"
    />

    <!-- Desktop list -->
    <div class="desktop-only">
      <ul class="category-list">
        <li
          v-for="{ node } in collections?.edges"
          :key="node.handle"
          class="category-item"
        >
          <NuxtLink
            :to="`/ecommerce/collection/${node.handle}`"
            class="bg-primary"
            :class="['category-link', { active: isActiveCollection(node.handle) }]"
          >
            {{ node.title }}
          </NuxtLink>
        </li>
      </ul>
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

/* Style de la liste */
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  margin-bottom: 10px;
}

.category-link {
  display: block;
  padding: 8px 12px;
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.category-link:hover {
  color: #818181;
}

.category-link.active {
  color: #332f2f;
  font-weight: 600;
  border-left: 3px solid #332f2f;
  border-radius: 4px;
}
</style>
