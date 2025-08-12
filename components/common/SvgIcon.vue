<!-- components/common/SvgIcon.vue -->
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    role="img"
  >
    <path :d="path" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  mdiBriefcase, mdiSchool, mdiLightbulb, mdiTranslate, mdiHeart,
  mdiCertificate, mdiTrophy, mdiStar, mdiCog, mdiAccount, mdiBook,
  mdiLanguageJavascript, mdiLanguagePhp, mdiLanguageHtml5, mdiLanguageCss3,
  mdiFileDocumentOutline, mdiCertificateOutline, mdiMedalOutline,
  mdiShapeOutline
} from '@mdi/js'

const props = withDefaults(defineProps<{
  name?: string
  size?: number | string
}>(), {
  size: 20,
})

/** Map des noms "mdi-xxx" -> chemin SVG (@mdi/js) */
const MAP: Record<string, string> = {
  'mdi-briefcase': mdiBriefcase,
  'mdi-school': mdiSchool,
  'mdi-lightbulb': mdiLightbulb,
  'mdi-translate': mdiTranslate,
  'mdi-heart': mdiHeart,
  'mdi-certificate': mdiCertificate,
  'mdi-trophy': mdiTrophy,
  'mdi-star': mdiStar,
  'mdi-cog': mdiCog,
  'mdi-account': mdiAccount,
  'mdi-book': mdiBook,
  'mdi-language-javascript': mdiLanguageJavascript,
  'mdi-language-php': mdiLanguagePhp,
  'mdi-language-html5': mdiLanguageHtml5,
  'mdi-language-css3': mdiLanguageCss3,
  'mdi-file-document-outline': mdiFileDocumentOutline,
  'mdi-certificate-outline': mdiCertificateOutline,
  'mdi-medal-outline': mdiMedalOutline,
  'mdi-shape-outline': mdiShapeOutline,
}

const path = computed(() => MAP[props.name ?? 'mdi-shape-outline'] ?? mdiShapeOutline)
</script>

<style scoped>
svg { display: inline-block; vertical-align: middle; }
</style>
