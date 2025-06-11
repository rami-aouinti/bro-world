<script setup lang="ts">
import Language from "~/components/App/AppBar/Language.vue";
import User from "~/components/App/AppBar/User.vue";
import Screen from "~/components/App/AppBar/Screen.vue";
import Navigation from "~/components/App/AppBar/Navigation.vue";
import Switch from "~/components/App/AppBar/Switch.vue";
import Notification from "~/components/App/AppBar/Notification.vue";
import Messenger from "~/components/App/AppBar/Messenger.vue";
import type {ShopifyCartLineItem} from "~/modules/shopify/types";
const { loggedIn} = useUserSession()

import {useShopifyCart} from "~/modules/shopify/composables/useShopifyCart";

const { cart } = useShopifyCart()

const drawer = useState('drawer')
const route = useRoute()
const breadcrumbs = computed(() => {
  return route!.matched
    .filter((item) => item.meta && item.meta.title)
    .map((r) => ({
      title: r.meta.title!,
      disabled: r.path === route.path || false,
      to: r.path,
    }))
})
const emit = defineEmits<{
  (e: 'toggleSettingsDrawer', value: boolean): void
}>()

</script>

<template>
  <v-app-bar flat>
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-breadcrumbs :items="breadcrumbs" />
    <v-spacer />
    <Navigation></Navigation>
    <Screen></Screen>
    <div id="app-bar" />
    <Notification v-if="loggedIn"></Notification>
    <Messenger v-if="loggedIn"></Messenger>
    <v-btn
      icon
      title="Shopping"
      aria-label="shopping"
      class="opacity-80 ml-0"
      @click="emit('toggleSettingsDrawer', true)"
    >
      <v-badge
        v-if="cart?.lines.edges.length > 0"
        color="primary"
        :content="cart?.lines.edges.length"
      >
        <template #default>
          <v-icon>mdi-shopping</v-icon>
        </template>
      </v-badge>

      <v-icon v-else>mdi-shopping</v-icon>
    </v-btn>
    <User></User>
    <Language></Language>
    <Switch></Switch>
  </v-app-bar>
</template>
