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
        <PluginList :plugin="plugin" class="text-end" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PluginList from "~/components/PluginList.vue"

const { t, locale } = useI18n()

definePageMeta({ layout: 'default', breadcrumb: 'disabled', description: 'Plugin page' })

const plugins = ref([
  {
    key: 'ecommerce',
    name: t('plugin.ecommerce.name'),
    description: t('plugin.ecommerce.description'),
    icon: 'mdi-shopping',
    installed: true,
    link: '/shopping',
    pricing: t('plugin.pricing.free'),
    action: t('plugin.actions.open'),
  },
  {
    key: 'calendar',
    name: t('plugin.calendar.name'),
    description: t('plugin.calendar.description'),
    icon: 'mdi-calendar-clock',
    installed: true,
    link: '/calendar',
    pricing: t('plugin.pricing.paid'),
    action: t('plugin.actions.open'),
  },
  {
    key: 'chat',
    name: t('plugin.chat.name'),
    description: t('plugin.chat.description'),
    icon: 'mdi-chat',
    installed: false,
    link: '/inbox',
    pricing: t('plugin.pricing.free'),
    action: t('plugin.actions.install'),
  },
  {
    key: 'game',
    name: t('plugin.game.name'),
    description: t('plugin.game.description'),
    icon: 'mdi-gamepad-variant',
    installed: true,
    link: '/game',
    pricing: t('plugin.pricing.paid'),
    action: t('plugin.actions.open'),
  },
  {
    key: 'blog',
    name: t('plugin.blog.name'),
    description: t('plugin.blog.description'),
    icon: 'mdi-file-document',
    installed: true,
    link: '/home',
    pricing: t('plugin.pricing.free'),
    action: t('plugin.actions.open'),
  },
  {
    key: 'crm',
    name: t('plugin.crm.name'),
    description: t('plugin.crm.description'),
    icon: 'mdi-table-large',
    installed: true,
    link: '/crm',
    pricing: t('plugin.pricing.free'),
    action: t('plugin.actions.open'),
  },
  {
    key: 'job',
    name: t('plugin.job.name'),
    description: t('plugin.job.description'),
    icon: 'mdi-table-large',
    installed: true,
    link: '/jobs',
    pricing: t('plugin.pricing.free'),
    action: t('plugin.actions.open'),
  }
])
</script>

<style scoped>
.text-end {
  direction: rtl;
  text-align: right;
}
</style>
