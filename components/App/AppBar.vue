<script setup lang="ts">
import Language from "~/components/App/AppBar/Language.vue";
import User from "~/components/App/AppBar/User.vue";
import Screen from "~/components/App/AppBar/Screen.vue";
import Navigation from "~/components/App/AppBar/Navigation.vue";
import Switch from "~/components/App/AppBar/Switch.vue";
import Notification from "~/components/App/AppBar/Notification.vue";
import Messenger from "~/components/App/AppBar/Messenger.vue";


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

</script>

<template>
  <v-app-bar flat>
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-breadcrumbs :items="breadcrumbs" />
    <v-spacer />
    <Navigation></Navigation>
    <Screen></Screen>
    <div id="app-bar" />
    <Switch></Switch>
    <Notification></Notification>
    <Messenger></Messenger>
    <User></User>
    <Language></Language>
  </v-app-bar>
</template>
