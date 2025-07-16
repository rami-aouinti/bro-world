<template>
  <v-app-bar
    app
    flat
    height="64"
    :class="rtl ? 'app-bar-rtl' : 'app-bar-ltr'"
    role="banner"
    aria-label="Top navigation bar"
    class="px-4"
  >
    <template #prepend>
      <NuxtLink
        :to="localePath('/home')"
        class="text-h5 font-weight-bold drawer-header-icon text-decoration-none"
        style="color: inherit;"
      >
        <v-icon icon="custom:world-logo" color="primary" />
        <template class="px-2" v-if="!mobile">
          <span :class="isDark ? 'text-white' : 'text-default'">Bro</span>
          <span class="text-primary">World</span></template>
      </NuxtLink>
    </template>

    <div id="app-bar" />

    <!-- Centrage des boutons et cachés en mobile -->
    <v-row v-if="!mobile" class="mx-auto" align="center" justify="center" dense>
      <v-btn color="primary" :to="localePath('/courses')" class="mx-2" variant="text">
        <v-icon :color="isDark ? 'white' : 'default'" size="32">mdi-school</v-icon>
      </v-btn>
      <v-btn color="primary" :to="localePath('/jobs')" class="mx-2" variant="text">
        <v-icon :color="isDark ? 'white' : 'default'" size="32">mdi-briefcase</v-icon>
      </v-btn>
      <v-btn color="primary" :to="localePath('/shop')" class="mx-2" variant="text">
        <v-icon :color="isDark ? 'white' : 'default'" size="32">mdi-storefront</v-icon>
      </v-btn>
      <v-btn color="primary" :to="localePath('/crm')" class="mx-2" variant="text">
        <v-icon :color="isDark ? 'white' : 'default'" size="32">mdi-database</v-icon>
      </v-btn>
      <v-btn color="primary" :to="localePath('/quiz')" class="mx-2" variant="text">
        <v-icon :color="isDark ? 'white' : 'default'" size="32">mdi-gamepad-variant</v-icon>
      </v-btn>
    </v-row>

    <v-spacer />

    <Switch />
    <Navigation />
    <Screen />

    <v-btn
      icon
      color="primary"
      aria-label="Shop"
      title="Shop"
      @click="emit('toggleSettingsDrawer', true)"
    >
      <v-badge
        v-if="cart?.lines.edges.length > 0"
        :content="cart?.lines.edges.length"
        color="primary"
      >
        <v-icon :color="isDark ? 'white' : 'default'">mdi-shopping</v-icon>
      </v-badge>
      <v-icon :color="isDark ? 'white' : 'default'" v-else>mdi-shopping</v-icon>
    </v-btn>

    <Messenger v-if="loggedIn" />
    <Notification v-if="loggedIn" />
    <User />
    <Language />
  </v-app-bar>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Navigation from "~/components/App/AppBar/Navigation.vue"
import Screen from "~/components/App/AppBar/Screen.vue"
const Notification = defineAsyncComponent(() => import("~/components/App/AppBar/Notification.vue"))
const Messenger = defineAsyncComponent(() => import("~/components/App/AppBar/Messenger.vue"))
import User from "~/components/App/AppBar/User.vue"
import Language from "~/components/App/AppBar/Language.vue"
import Switch from "~/components/App/AppBar/Switch.vue"

import { useRoute } from 'vue-router'
import { computed } from 'vue'

const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
import { useShopifyCart } from "~/modules/shopify/composables/useShopifyCart"

const props = defineProps({ rtl: Boolean, mobile: Boolean })
const emit = defineEmits(['toggleSettingsDrawer'])
const localePath = useLocalePath()
const drawer = useState('drawer')
const route = useRoute()
const { cart } = useShopifyCart()
const { loggedIn } = useUserSession()
</script>

<style scoped>
.app-bar-rtl {
  direction: rtl;
}

.app-bar-ltr {
  direction: ltr;
}
</style>
