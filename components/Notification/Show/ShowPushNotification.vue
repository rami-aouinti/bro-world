<script setup lang="ts">
import { ref, defineProps } from 'vue'

const props = defineProps({
  notification: { type: Array, default: () => [] },
})


function formatDate(dateString: string): string {
  if (!dateString) return ''
  return dateString.split('T')[0] + ' ' + dateString.split('T')[1].split('.')[0]
}
</script>
<template>
  <v-container>
    <v-row dense>
      <h5> {{ props.notification?.id }}</h5>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <p>Channel</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>{{ props.notification?.channel }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>Scope</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>{{ props.notification?.scope }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>Topic</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>{{ props.notification?.topic }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>Push Title</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>{{ props.notification?.pushTitle }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>Push Subtitle</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>{{ props.notification?.pushSubtitle }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>Push Content</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>{{ props.notification?.pushContent }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>Created At</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>
              {{ formatDate(props.notification?.createdAt) }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <p>Completed At</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>
              {{ formatDate(props.notification?.completedAt) }}
            </p>
          </v-col>
        </v-row>

      </v-card-text>
    </v-row>
  </v-container>
</template>
<style>
</style>
