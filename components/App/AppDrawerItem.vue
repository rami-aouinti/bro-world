<template>
  <v-list-item
    v-if="isItem && icon"
    :to="localePath(to)"
    :prepend-icon="icon"
    :title="title"
    active-class="text-primary"
    role="menuitem"
    :aria-label="`Go to ${title}`"
    class="drawer-item"
    :class="{ 'rtl-fix': isRtl }"
  />

  <v-list-group
    v-else-if="icon"
    :prepend-icon="icon"
    color="primary"
    role="group"
    :aria-label="`${title} submenu`"
    class="drawer-item"
    :class="{ 'rtl-fix': isRtl }"
  >
    <template #activator="{ props: vProps }">
      <v-list-item
        v-bind="vProps"
        :title="title"
        role="button"
        :aria-haspopup="true"
        :aria-expanded="vProps?.expanded"
      />
    </template>

    <AppDrawerItem
      v-for="child in visibleChildren"
      :key="child.name"
      :item="child"
      class="sub-item"
    />
  </v-list-group>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'

const { locale } = useI18n()
const isRtl = computed(() => locale.value === 'ar')
const localePath = useLocalePath()

const { item } = defineProps<{ item: RouteRecordRaw }>()

const visibleChildren = computed(() =>
  item.children?.filter(child => child.meta?.icon).sort(
    (a, b) => (a.meta?.drawerIndex ?? 99) - (b.meta?.drawerIndex ?? 98)
  )
)

const visibleChildrenNum = computed(() => visibleChildren.value?.length || 0)
const isItem = computed(() => !item.children || visibleChildrenNum.value <= 1)
const title = toRef(() => item.meta?.title || 'Menu Item')
const icon = toRef(() => item.meta?.icon)

const to = computed(() => ({
  name: item.name || visibleChildren.value?.[0].name,
}))
</script>

<style scoped>
.sub-item {
  padding-left: 16px !important;
}

.rtl-fix .sub-item {
  padding-left: 0 !important;
  padding-right: 16px !important;
}

.drawer-item {
  direction: ltr;
}

.rtl-fix {
  direction: rtl;
}

.rtl-fix .v-list-item__prepend {
  order: 2;
  margin-inline-start: 12px !important;
  margin-inline-end: 0 !important;
}

.rtl-fix .v-list-item__content {
  order: 1;
  text-align: right;
}
</style>
