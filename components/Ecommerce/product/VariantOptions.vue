<script setup lang="ts">
import type {ShopifyProduct} from "~/modules/shopify/types";
import { computed } from 'vue'
defineProps<{ product?: ShopifyProduct }>()

const router = useRouter()
const route = useRoute()

function toggleOption(name: string, value: string) {
  router.replace({ query: { ...route.query, [name]: route.query[name] === value ? undefined : value } })
}
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
function isSelected(name: string, value: string) {
  return route.query[name] === value
}
</script>

<template>
  <h2 class="related-title my-3" :class="isDark ? 'text-white' : 'text-default'">Variants</h2>

  <v-row>
    <v-col v-for="option in product?.options"
           :key="option.id" cols="12" md="6">
      <p class="mb-2 font-weight-bold" :class="isDark ? 'text-white' : 'text-default'">
        {{ option.name }}
      </p>
      <div class="flex gap-2 flex-nowrap overflow-auto">
        <v-btn
          v-for="value in option.values"
          :key="value"
          :color="isSelected(option.name, value) ? 'primary' : 'default'"
          variant="outlined"
          class="whitespace-nowrap min-w-fit mx-1"
          @click="toggleOption(option.name, value)"
        >
          {{ value }}
        </v-btn>
      </div>
    </v-col>
  </v-row>

</template>

