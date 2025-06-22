<script setup lang="ts">
defineProps({
  right: Boolean
})

import AppDrawerItem from "~/components/App/AppDrawerItem.vue"
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import { useLocalePath } from '#i18n'
import { useI18n } from 'vue-i18n'
import { computed, ref, onMounted } from 'vue'

const isClientMounted = ref(false) // ← important
onMounted(() => {
  isClientMounted.value = true
  // On force drawerState à false côté client uniquement
  drawerState.value = false
})

const drawerState = useState('drawer', () => false)
const { mobile } = useDisplay()

const drawer = computed({
  get: () => isClientMounted.value && (drawerState.value || !mobile.value),
  set: (val: boolean) => {
    if (isClientMounted.value) drawerState.value = val
  },
})

const rail = computed(() => !drawerState.value && !mobile.value)

const router = useRouter()
const { user } = useUserSession()
const localePath = useLocalePath()
const { locale } = useI18n()

const isRtl = computed(() => locale.value === 'ar')

const routes = router.getRoutes().filter((r) => {
  const isTopLevel = r.path.lastIndexOf('/') === 0
  if (r.meta?.requiredRoles) {
    const required = r.meta.requiredRoles
    if (!user.value?.roles?.some((role: string) => required.includes(role))) {
      return false
    }
  }
  return isTopLevel
})

routes.sort((a, b) => (a.meta?.drawerIndex ?? 99) - (b.meta?.drawerIndex ?? 98))

const currentYear = new Date().getFullYear()

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})

</script>


<template>
  <v-navigation-drawer
    :location="right ? 'right' : 'left'"
    permanent
    v-model="drawer"
    :expand-on-hover="rail"
    :rail="rail"
    floating
    role="navigation"
    aria-label="Main Navigation Drawer"
  >
    <!-- En-tête -->
    <template #prepend>
      <v-list v-if="isMounted" role="navigation" aria-label="Brand Navigation">
        <v-list-item
          class="pa-1 drawer-header"
          :class="{ 'rtl-fix': isRtl }"
          :to="localePath('/home')"
          link
          aria-label="Go to homepage"
        >
          <template #prepend>
            <v-icon
              icon="custom:world-logo"
              size="x-large"
              class="drawer-header-icon"
              color="primary"
              aria-hidden="true"
            />
          </template>
          <v-list-item-title
            class="text-h5 font-weight-bold"
            style="line-height: 2rem"
          >
            Bro <span class="text-primary">World</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </template>

    <!-- Liens -->
    <v-list v-if="isMounted" nav density="default" role="list" aria-label="Main Menu Links">
      <AppDrawerItem
        v-for="route in routes"
        :key="route.name"
        :item="route"
        class="mb-2"
      />
    </v-list>

    <v-spacer />

    <!-- Pied -->
    <template #append>
      <v-list-item class="drawer-footer px-0 d-flex flex-column justify-center">
        <div class="text-caption pt-6 pt-md-0 text-center text-no-wrap">
          &copy; {{ currentYear }} Copyright
          <a
            href="https://github.com/rami-aouinti"
            class="font-weight-bold text-primary"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Rami Aouinti's GitHub profile"
          >
            Bro World
          </a>
        </div>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.v-navigation-drawer {
  transition-property: box-shadow, transform, visibility, width, height, left,
  right, top, bottom, border-radius;
  overflow: hidden;
}

.drawer-header {
  display: flex;
  align-items: center;
}

.drawer-header .v-list-item__content {
  text-align: left;
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

.drawer-footer {
  transition: transform 0.2s ease;
  min-height: 30px;
}

.drawer-header-icon {
  opacity: 1;
  height: 1.2em;
  width: 1.2em;
  transition: transform 0.2s ease, opacity 0.2s ease;
  margin-right: 5px;
}
</style>
