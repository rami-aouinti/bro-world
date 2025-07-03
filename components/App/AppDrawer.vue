<template>
  <v-navigation-drawer
    app
    :model-value="drawer"
    @update:model-value="val => drawer = val"
    :location="right ? 'right' : 'left'"
    :temporary="mobile"
    :expand-on-hover="rail"
    :rail="rail"
    floating
    aria-label="Main Navigation Drawer"
    role="navigation"
  >
    <template #prepend>
      <v-list role="navigation" aria-label="Brand">
        <v-list-item
          class="pa-1 drawer-header"
          :class="{ 'rtl-fix': isRtl }"
          :to="localePath('/home')"
          link
        >
          <template #prepend>
            <v-icon
              icon="custom:world-logo"
              size="x-large"
              class="drawer-header-icon"
              color="primary"
            />
          </template>
          <v-list-item-title class="text-h6 font-weight-bold">Bro <span class="text-primary">World</span></v-list-item-title>
        </v-list-item>
      </v-list>
    </template>

    <v-list nav density="default" role="list" aria-label="Main Menu">
      <AppDrawerItem
        v-for="route in filteredRoutes"
        :key="route.name"
        :item="route"
        class="mb-2"
      />
    </v-list>

    <v-spacer />

    <template #append>
      <v-list-item v-if="!rail" class="drawer-footer px-0 d-flex flex-column justify-center">
        <div class="text-caption pt-6 pt-md-0 text-center text-no-wrap">
          &copy; {{ currentYear }} <a href="https://github.com/rami-aouinti" class="font-weight-bold text-primary" target="_blank">Bro World</a>
        </div>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import AppDrawerItem from './AppDrawerItem.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed, ref, defineProps, onMounted } from 'vue'
import { useLocalePath } from '#i18n'

const props = defineProps({
  right: Boolean,
  mobile: Boolean
})

const drawerState = useState('drawer', () => false)
const isClientMounted = ref(false)
onMounted(() => { isClientMounted.value = true })

const drawer = computed({
  get: () => isClientMounted.value && (drawerState.value || !props.mobile),
  set: (val: boolean) => { if (isClientMounted.value) drawerState.value = val }
})

const rail = computed(() => !drawerState.value && !props.mobile)

const { locale } = useI18n()
const isRtl = computed(() => locale.value === 'ar')
const localePath = useLocalePath()

const { user } = useUserSession()
const router = useRouter()

const filteredRoutes = computed(() => {
  return router.getRoutes()
    .filter(r => r.path.lastIndexOf('/') === 0 && (!r.meta?.requiredRoles || user.value?.roles?.some(role => r.meta.requiredRoles.includes(role))))
    .sort((a, b) => (a.meta?.drawerIndex ?? 99) - (b.meta?.drawerIndex ?? 98))
})

const currentYear = new Date().getFullYear()
</script>

<style scoped>
.v-navigation-drawer {
  overflow: hidden;
}

.drawer-header {
  display: flex;
  align-items: center;
}

.rtl-fix {
  direction: rtl;
}

.rtl-fix .v-list-item__prepend {
  order: 2;
  margin-inline-start: 12px;
  margin-inline-end: 0;
}

.rtl-fix .v-list-item__content {
  order: 1;
  text-align: right;
}

.drawer-footer {
  min-height: 30px;
}

.drawer-header-icon {
  margin-right: 5px;
}
</style>
