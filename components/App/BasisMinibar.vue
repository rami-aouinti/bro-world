<script setup lang="ts">
const items = [
  { title: "Settings", icon: "mdi-account-settings-variant", color: "deep-purple", path: "/setting" },
  { title: "Calendar", icon: "mdi-calendar", color: "amber", path: "/calendar" },
  { title: "My Jobs", icon: "mdi-briefcase", color: "blue", path: "/jobs" },
  { title: "Company", icon: "mdi-database", color: "teal", path: "/crm" },
  { title: "My Courses", icon: "mdi-school", color: "green", path: "/courses" },
  { title: "My Files", icon: "mdi-folder", color: "orange", path: "/user/channel/media" },
];

</script>
<template>
  <v-list
    style="background-color: transparent;"
    :lines="false"
    nav
  >
    <v-list-item
      v-for="(item, i) in items"
      :to="item.path"
      :key="i"
      :value="item"
      color="primary"
    >
      <template v-slot:prepend>
        <v-icon :color="item.color" :icon="item.icon"></v-icon>
      </template>

      <v-list-item-title v-text="item.title"></v-list-item-title>
    </v-list-item>
  </v-list>
</template>
