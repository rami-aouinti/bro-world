<script setup lang="ts">
import { mergeProps, ref } from 'vue'
import UserAvatar from "~/components/App/UserAvatar.vue";
const { loggedIn, clear, user } = useUserSession()
const loggedUser = ref([
  {
    icon: "mdi-face",
    path: "/profile",
    title: "Profile",
  },
  {
    icon: "mdi-account-settings-variant",
    path: "/setting",
    title: "Setting",
  },
  {
    icon: "mdi-shopping",
    path: "/shopping",
    title: "Shopping",
  },
  {
    icon: "mdi-network",
    path: "/job",
    title: "Jobs",
  },
  {
    icon: "mdi-table-large",
    path: "/crm",
    title: "Crm",
  },
  {
    icon: "mdi-calendar-clock",
    path: "/calendar",
    title: "Calendar",
  },
  {
    icon: "mdi-gamepad-variant",
    path: "/quiz",
    title: "Quiz",
  }
])
const notLoggedUser = ref([
  {
    icon: "mdi-login",
    path: "/login",
    title: "Login",
  },
])
</script>
<template>
  <v-menu
    location="bottom"
    transition="slide-y-transition"
    offset-y
    offset-x
    width="200"
  >
    <template #activator="{ props: menu }">
      <v-tooltip location="bottom">
        <template #activator="{ props: tooltip }">
          <v-btn icon v-bind="mergeProps(menu, tooltip)" class="ml-1">
            <v-icon v-if="!loggedIn" icon="mdi-account-circle" size="32" />
            <UserAvatar v-else :user="user" size="32" color="primary"></UserAvatar>
          </v-btn>
        </template>
        <span>{{ loggedIn ? user!.login : 'User' }}</span>
      </v-tooltip>
    </template>
    <v-list class="pa-1" v-if="loggedIn">
      <v-list-item
        v-for="(item, i) in loggedUser"
        :prepend-icon="item.icon"
        :href="item.path"
        :key="i"
        class="
                list-item-hover-active
                d-flex
                align-items-center
                border-radius-md
              "
      >
        <v-list-item-title
          class="text-body-2 ls-0 text-typo font-weight-600 mb-0"
        >
          <v-row>
            <v-col>
              <h6
                class="text-sm font-weight-normal ms-2 text-typo"
              >
                {{ item.title }}
              </h6>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list-item
        prepend-icon="mdi-logout"
        @click="clear"
      >
        <v-list-item-title
          class="text-body-2 ls-0 text-typo font-weight-600 mb-0"
        >
          <v-row>
            <v-col>
              <h6
                class="text-sm font-weight-normal ms-2 text-typo"
              >
                Logout
              </h6>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-list class="pa-1" v-else>
      <v-list-item
        v-for="(item, i) in notLoggedUser"
        :prepend-icon="item.icon"
        :href="item.path"
        :key="i"
        class="
                list-item-hover-active
                d-flex
                align-items-center
                border-radius-md
              "
      >
        <v-list-item-title
          class="text-body-2 ls-0 text-typo font-weight-600 mb-0"
        >
          <v-row>
            <v-col>
              <h6
                class="text-sm font-weight-normal ms-2 text-typo"
              >
                {{ item.title }}
              </h6>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
