<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'
import AppDrawerItem from './AppDrawerItem.vue'

const { locale } = useI18n()
const isRtl = computed(() => locale.value === 'ar')

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

const localePath = useLocalePath()

const to = computed(() => ({
  name: item.name || visibleChildren.value?.[0].name,
}))


</script>

<template>
  <!-- Élément simple -->
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

  <!-- Élément avec sous-menus -->
  <v-list-group
    v-else-if="icon"
    :prepend-icon="icon"
    color="primary"
    role="menuitem"
    :aria-label="`${title} avec sous-menu`"
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
      class="sub-item pl-8"
    />
  </v-list-group>
</template>

<style scoped>
/* Force un léger décalage à gauche pour les sous-items (LTR) */
:deep(.sub-item.v-list-item) {
  padding-left: 12px !important;
}

/* En RTL : décaler à droite plutôt */
.rtl-fix :deep(.sub-item.v-list-item) {
  padding-left: 0 !important;
  padding-right: 12px !important;
}

/* comportement normal */
.drawer-item {
  direction: ltr;
}

/* correction RTL */
.rtl-fix {
  direction: rtl;
}

/* Pour forcer l’ordre visuel de l’icône et du texte */
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
