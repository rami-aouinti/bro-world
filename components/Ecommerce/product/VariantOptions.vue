<script setup lang="ts">
import type {ShopifyProduct} from "~/modules/shopify/types";

defineProps<{ product?: ShopifyProduct }>()

const router = useRouter()
const route = useRoute()

function toggleOption(name: string, value: string) {
  router.replace({ query: { ...route.query, [name]: route.query[name] === value ? undefined : value } })
}

function isSelected(name: string, value: string) {
  return route.query[name] === value
}
</script>

<template>
  <div
    v-for="option in product?.options"
    :key="option.id"
    class="my-6"
  >
    <p class="mb-2 text-slate-400">
      {{ option.name }}
    </p>
    <div
      class="flex gap-4 flex-wrap"
    >
      <v-btn
        v-for="value in option.values"
        :key="value"
        :color="isSelected(option.name, value) ? 'primary' : ''"
        :variant="isSelected(option.name, value) ? 'solid' : 'outline'"
        class="min-w-16 justify-center"
        @click="toggleOption(option.name, value)"
      >
        {{ value }}
      </v-btn>
    </div>
  </div>
</template>
