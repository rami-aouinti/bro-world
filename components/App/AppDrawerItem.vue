<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'

const { item } = defineProps<{
  item: RouteRecordRaw
}>()

const visibleChildren = computed(() =>
  item.children
    ?.filter((child) => child.meta?.icon)
    .sort((a, b) => (a.meta?.drawerIndex ?? 99) - (b.meta?.drawerIndex ?? 98)),
)

const visibleChildrenNum = computed(() => visibleChildren.value?.length || 0)
const isItem = computed(() => !item.children || visibleChildrenNum.value <= 1)
const title = toRef(() => item.meta?.title || 'Menu Item')
const icon = toRef(() => item.meta?.icon)

// @ts-expect-error unknown type miss match
const to = computed<RouteRecordRaw>(() => ({
  name: item.name || visibleChildren.value?.[0].name,
}))
</script>

<template>
  <v-list-item
    v-if="isItem && icon"
    :to="to"
    :prepend-icon="icon"
    :title="title"
    active-class="text-primary"
    role="menuitem"
    :aria-label="`Aller à ${title}`"
  />

  <v-list-group
    v-else-if="icon"
    :prepend-icon="icon"
    color="primary"
    role="menuitem"
    :aria-label="`${title} avec sous-menu`"
  >
    <template #activator="{ props: vProps }">
      <v-list-item
        v-bind="vProps"
        :title="title"
        role="button"
        :aria-haspopup="true"
        :aria-expanded="vProps?.expanded"
        :aria-label="`Ouvrir le sous-menu ${title}`"
      />
    </template>

    <AppDrawerItem
      v-for="child in visibleChildren"
      :key="child.name"
      :item="child"
    />
  </v-list-group>
</template>
