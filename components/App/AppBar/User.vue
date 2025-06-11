<script setup lang="ts">
import { mergeProps, ref } from 'vue'
import UserAvatar from "~/components/App/UserAvatar.vue";

const { loggedIn, clear, user } = useUserSession()

const loggedUser = ref([
  { icon: "mdi-account-settings-variant", path: "/setting", title: "Setting" },
  { icon: "mdi-network", path: "/plugin", title: "Apps" },
  { icon: "mdi-help-circle", path: "/help", title: "Help" },
  { icon: "mdi-information", path: "/about", title: "About" },
  { icon: "mdi-message", path: "/contact", title: "Contact" },
])

const notLoggedUser = ref([
  { icon: "mdi-login", path: "/login", title: "Login" },
  { icon: "mdi-account-plus", path: "/register", title: "Register" },
  { icon: "mdi-help-circle", path: "/help", title: "Help" },
  { icon: "mdi-information", path: "/about", title: "About" },
  { icon: "mdi-message", path: "/contact", title: "Contact" },
])
</script>

<template>
  <v-menu location="bottom" transition="slide-y-transition" offset-y offset-x width="200">
    <template #activator="{ props: menu }">
      <v-btn aria-label="account" title="account" icon v-bind="mergeProps(menu)" class="ml-0">
        <v-icon v-if="!loggedIn" icon="mdi-account-circle" size="32" />
        <UserAvatar v-if="loggedIn && user" :user="user" size="32" color="primary" />
      </v-btn>
    </template>

    <v-list class="pa-1" v-if="loggedIn">
      <v-list-item prepend-icon="mdi-face" to="/profile">
        <v-list-item-title class="text-body-2 ls-0 text-typo font-weight-600 mb-0">
          <v-row>
            <v-col>
              <h6 class="text-sm font-weight-normal ms-2 text-typo">Profile</h6>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        v-for="(item, i) in loggedUser"
        :key="i"
        :prepend-icon="item.icon"
        :to="item.path"
        class="list-item-hover-active d-flex align-items-center border-radius-md"
      >
        <v-list-item-title class="text-body-2 ls-0 text-typo font-weight-600 mb-0">
          <v-row>
            <v-col>
              <h6 class="text-sm font-weight-normal ms-2 text-typo">{{ item.title }}</h6>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item>

      <v-divider />

      <v-list-item prepend-icon="mdi-logout" @click="clear">
        <v-list-item-title class="text-body-2 ls-0 text-typo font-weight-600 mb-0">
          <v-row>
            <v-col>
              <h6 class="text-sm font-weight-normal ms-2 text-typo">Logout</h6>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-list class="pa-1" v-else>
      <v-list-item
        v-for="(item, i) in notLoggedUser"
        :key="i"
        :prepend-icon="item.icon"
        :to="item.path"
        class="list-item-hover-active d-flex align-items-center border-radius-md"
      >
        <v-list-item-title class="text-body-2 ls-0 text-typo font-weight-600 mb-0">
          <v-row>
            <v-col>
              <h6 class="text-sm font-weight-normal ms-2 text-typo">{{ item.title }}</h6>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
