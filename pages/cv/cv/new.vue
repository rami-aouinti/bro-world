<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CVEditor from "~/components/Job/CVEditor.vue";
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

</script>

<template>
  <v-container>
    <CVEditor></CVEditor>
  </v-container>
</template>
