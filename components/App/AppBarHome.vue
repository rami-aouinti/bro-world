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
      <NuxtLink v-if="!mobile" :to="localePath('/home')" class=" text-h5 font-weight-bold drawer-header-icon text-decoration-none" style="color: inherit;">
        <v-icon
          icon="custom:world-logo"
          color="primary"
        />
        Bro <span class="text-primary">World</span>

      </NuxtLink>
      <NuxtLink v-else :to="localePath('/home')" class=" text-h5 font-weight-bold drawer-header-icon text-decoration-none" style="color: inherit;">
        <v-icon
          icon="custom:world-logo"
          color="primary"
        />

      </NuxtLink>
    </template>

    <div id="app-bar" />
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
        <v-icon>mdi-shopping</v-icon>
      </v-badge>
      <v-icon v-else>mdi-shopping</v-icon>
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

import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useShopifyCart } from "~/modules/shopify/composables/useShopifyCart"

const props = defineProps({ rtl: Boolean, mobile: Boolean })
const emit = defineEmits(['toggleSettingsDrawer'])
const localePath = useLocalePath()
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
