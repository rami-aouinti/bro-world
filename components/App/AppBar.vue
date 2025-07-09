<template>
  <v-app-bar
    app
    flat
    height="64"
    :class="rtl ? 'app-bar-rtl' : 'app-bar-ltr'"
    role="banner"
    aria-label="Top navigation bar"
  >
    <v-app-bar-nav-icon
      @click="drawer = !drawer"
      aria-label="Toggle drawer"
      :title="rtl ? 'إظهار القائمة' : 'Toggle drawer'"
    />

    <v-breadcrumbs
      :items="breadcrumbs"
      color="secondary"
      class="mx-2 d-none d-lg-block"
      :aria-label="rtl ? 'المسار الحالي' : 'Breadcrumb'"
    />

    <v-spacer />

    <Navigation />
    <Screen />
    <Notification v-if="loggedIn" />
    <Messenger v-if="loggedIn" />

    <v-btn
      icon
      color="secondary"
      aria-label="Settings"
      title="Settings"
      @click="emit('toggleSettingsDrawer', true)"
    >
      <v-badge
        v-if="cart?.lines.edges.length > 0"
        :content="cart?.lines.edges.length"
        color="primary"
      >
        <v-icon>mdi-shopping</v-icon>
      </v-badge>
      <v-icon v-else>mdi-shopping</v-icon>
    </v-btn>

    <User />
    <Language />
    <Switch />
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

import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useShopifyCart } from "~/modules/shopify/composables/useShopifyCart"

const props = defineProps({ rtl: Boolean })
const emit = defineEmits(['toggleSettingsDrawer'])

const drawer = useState('drawer')
const route = useRoute()
const { cart } = useShopifyCart()
const { loggedIn } = useUserSession()

const breadcrumbs = computed(() =>
  route.matched
    .filter((r) => r.meta && r.meta.title)
    .map((r) => ({
      title: r.meta.title,
      disabled: r.path === route.path,
      to: r.path,
    }))
)
</script>

<style scoped>
.app-bar-rtl {
  direction: rtl;
}

.app-bar-ltr {
  direction: ltr;
}
</style>
