<script setup lang="ts">
import { mergeProps, ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n';

const { locale, setLocale } = useI18n()

const languages = [
  { code: 'en', iso: 'en-US', name: 'English', icon: 'fi-us us' },
  { code: 'fr', iso: 'fr-FR', name: 'Français', icon: 'fi-fr fr' },
  { code: 'de', iso: 'de-DE', name: 'Deutsch', icon: 'fi-de de' },
  { code: 'ar', iso: 'en-US', name: 'العربية', icon: 'fi-tn tn' }
]
const currentLanguage = computed(() => languages.find(lang => lang.code === locale.value) || languages[0])

const changeLanguage = async (code) => {
  const selectedLang = languages.find(lang => lang.code === code);
  if (!selectedLang) return console.error(`Language not found: ${code}`);
  await setLocale(code);
  document.cookie = `i18n_redirected=${code}; path=/`;
}
</script>
<template>
  <v-menu location="bottom">
    <template #activator="{ props: menu }">
      <v-btn icon v-bind="mergeProps(menu)" class="ml-1">
        <span style="font-size: 20px" :class="`fi ${currentLanguage.icon}`"></span>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="lang in languages"
        :key="lang.code"
        @click="changeLanguage(lang.code)"
      >
        <template #prepend>
          <span style="font-size: 20px" :class="`fi ${lang.icon}`"></span>
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
