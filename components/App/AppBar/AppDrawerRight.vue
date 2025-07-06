<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  drawerWidth: string
}>()
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
const emit = defineEmits(['update:modelValue'])
const widthDrawer = mobile.value ? 'calc(100vw - 30px)' : 'calc(100vw - 80px)'
</script>

<template>
  <v-navigation-drawer
    v-model="props.modelValue"
    location="right"
    :width="props.modelValue ? 'calc(100vw - 30px)' : 0"
    temporary
    touchless
    scrim="rgba(0, 0, 0, 0.4)"
    style="top: 70px; height: calc(100vh - 120px); width: 95%; border-top-left-radius: 65px; border-bottom-left-radius: 65px; overflow: hidden;"
  >
    <div style="height: 100%; overflow-y: auto; padding: 10px; overflow-x: hidden; ">
      <!-- 🎯 Slot principal pour injecter n'importe quel contenu -->
      <slot />
    </div>
  </v-navigation-drawer>
</template>
<style>
.v-navigation-drawer {
  transition-property: box-shadow, transform, visibility, width, height, left,
  right, top, bottom, border-radius !important;
  overflow: hidden;
  &.v-navigation-drawer--rail {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    &.v-navigation-drawer--is-hovering {
      border-top-right-radius: 15px;
      border-bottom-right-radius: 15px;
      box-shadow:
        0px 1px 2px 0px rgb(0 0 0 / 30%),
        0px 1px 3px 1px rgb(0 0 0 / 15%);
    }
    &:not(.v-navigation-drawer--is-hovering) {
      .drawer-footer {
        transform: translateX(-160px);
      }
      .drawer-header-icon {
        height: 1em !important;
        width: 1em !important;
      }
      .v-list-group {
        --list-indent-size: 0px;
        --prepend-width: 0px;
      }
    }
  }
  .v-navigation-drawer__content {
    overflow-y: hidden;
    @supports (scrollbar-gutter: stable) {
      scrollbar-gutter: stable;
      > .v-list--nav {
        padding-right: 0;
      }
    }
    &:hover {
      overflow-y: overlay;
    }
  }
  .drawer-footer {
    transition: all 0.3s;
    min-height: 30px;
  }
  .drawer-header-icon {
    opacity: 1 !important;
    height: 1.2em !important;
    width: 1.2em !important;
    transition: all 0.3s;
    margin-right: -10px;
  }
  .v-list-group {
    --prepend-width: 10px;
  }
  .v-list-item {
    transition: all 0.3s;
  }
}
</style>
