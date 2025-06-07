<template>
  <v-container fluid>
    <v-card
      class="d-flex flex-column justify-space-between mx-3"
      rounded="xl"
      variant="text"
      min-height="180"
    >
      <v-toolbar>
        <v-toolbar-title>
          <div class="d-flex align-center">
            <v-icon start>{{ plugin.icon }}</v-icon>
            <span class="ml-2 font-weight-medium text-h7">
                  {{ plugin.name }}
                </span>
          </div>
        </v-toolbar-title>

        <template v-slot:append>
          <div class="d-flex ga-1">
            <v-btn icon="mdi-apps">
            </v-btn>
          </div>
        </template>
      </v-toolbar>

      <v-divider></v-divider>
      <div>
        <v-card-text>{{ truncate(plugin.description, 120)  }}</v-card-text>
      </div>

      <v-card-actions class="mt-auto d-flex align-center justify-space-between">
        <v-chip
          :color="plugin.pricing === 'free' ? 'green' : 'deep-purple'"
          size="small"
          class="text-uppercase font-weight-bold"
          label
        >
          {{ plugin.pricing === 'free' ? 'Free' : 'Paid' }}
        </v-chip>

        <div class="d-flex align-center gap-2">
          <v-btn
            v-if="plugin.installed"
            color="success"
            variant="outlined"
            size="small"
            :to="plugin.link"
          >
            Open
          </v-btn>
          <v-btn
            v-else
            color="primary"
            variant="outlined"
            size="small"
            :loading="loading"
            @click="installPlugin(plugin)"
          >
            Install
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {truncate} from "~/utils/stringUtils";
const loading = ref(false)
defineProps({
  plugin: {
    type: Object,
    required: true,
  },
})

function installPlugin(plugin) {
  loading.value = true

  setTimeout(() => {
    plugin.installed = true
    loading.value = false
    Notify.success(`Plugin ${plugin.name} installed successfully!`)
  }, 2000)
}
</script>
