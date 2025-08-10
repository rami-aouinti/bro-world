<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CoverLetterEditor from "~/components/Job/CoverLetterEditor.vue";
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

</script>

<template>
  <v-container>
    <CoverLetterEditor />
  </v-container>
</template>
