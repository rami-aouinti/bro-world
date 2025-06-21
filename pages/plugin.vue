<template>
  <v-container fluid>
    <v-row dense>
      <v-col
        v-for="plugin in plugins"
        :key="plugin.key"
        cols="12"
        sm="6"
        md="4"
      >
        <PluginList :plugin="plugin"></PluginList>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup lang="ts">

import PluginList from "~/components/PluginList.vue";
definePageMeta({
  layout: 'default',
  description: 'Plugin page',
  breadcrumb: 'disabled',
})
const plugins = ref([
  {
    key: 'ecommerce',
    name: 'Ecommerce',
    description:
      'Manage your online store with a complete ecommerce solution. Track orders, monitor inventory, analyze sales trends, and offer a smooth shopping experience to your customers across multiple channels.',
    icon: 'mdi-shopping',
    installed: true,
    link: '/shopping',
    pricing: 'free',
  },
  {
    key: 'calendar',
    name: 'Calendar',
    description:
      'Plan, organize, and manage your events with an intuitive calendar system. Sync with external services, set reminders, invite users, and get a clear overview of your schedules and upcoming deadlines.',
    icon: 'mdi-calendar-clock',
    installed: true,
    link: '/calendar',
    pricing: 'paid',
  },
  {
    key: 'chat',
    name: 'Live Chat',
    description:
      'Engage with your visitors in real-time using a built-in live chat system. Improve customer support, respond instantly, and convert more leads into paying users through direct interaction.',
    icon: 'mdi-chat',
    installed: false,
    link: '/inbox',
    pricing: 'free',
  },
  {
    key: 'game',
    name: 'Games',
    description:
      'Boost user engagement through interactive games and challenges. Integrate gamification features such as rewards, leaderboards, and quizzes to make your platform more fun and sticky.',
    icon: 'mdi-gamepad-variant',
    installed: true,
    link: '/game',
    pricing: 'paid',
  },
  {
    key: 'blog',
    name: 'Blog CMS',
    description:
      'Publish and manage content easily with a powerful blog editor. Schedule articles, optimize for SEO, embed media, and manage comments—all from one centralized and user-friendly interface.',
    icon: 'mdi-file-document',
    installed: true,
    link: '/home',
    pricing: 'free',
  },
  {
    key: 'crm',
    name: 'CRM',
    description:
      'Track leads, manage clients, and automate sales processes with a full-featured CRM system. Build strong relationships, follow up on deals, and drive revenue with ease.',
    icon: 'mdi-table-large',
    installed: true,
    link: '/crm',
    pricing: 'free',
  },
  {
    key: 'job',
    name: 'JOB',
    description:
      'Track leads, manage clients, and automate sales processes with a full-featured CRM system. Build strong relationships, follow up on deals, and drive revenue with ease.',
    icon: 'mdi-table-large',
    installed: true,
    link: '/jobs',
    pricing: 'free',
  },
])

</script>

<style scoped>

</style>
