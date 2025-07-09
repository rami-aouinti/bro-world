<script setup lang="ts">
import { mergeProps, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, setLocale } = useI18n()

const languages = [
  { code: 'en', iso: 'en-GB', name: 'English', icon: 'fi-gb gb' },
  { code: 'fr', iso: 'fr-FR', name: 'Français', icon: 'fi-fr fr' },
  { code: 'de', iso: 'de-DE', name: 'Deutsch', icon: 'fi-de de' },
  { code: 'ar', iso: 'ar-AR', name: 'العربية', icon: 'fi-tn tn' },
]

const currentLanguage = computed(() =>
  languages.find(lang => lang.code === locale.value) || languages[0]
)

const changeLanguage = async (code: string) => {
  const selectedLang = languages.find(lang => lang.code === code)
  if (!selectedLang) return console.error(`Language not found: ${code}`)
  await setLocale(code)
  document.cookie = `i18n_redirected=${code}; path=/`
}
</script>

<template>
  <v-menu location="bottom">
    <template #activator="{ props: menu }">
      <v-btn
        icon
        title="Language"
        variant="text"
        color="secondary"
        aria-label="Language"
        v-bind="mergeProps(menu)"
        class="mx-2"
      >
        <span class="border border-radius-xl shadow-2xl shadow-primary object-cover" :class="`fi ${currentLanguage.icon}`" style="width: 28px; height:24px;" />
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="lang in languages"
        :key="lang.code"
        @click="changeLanguage(lang.code)"
      >
        <template #prepend>
          <span class="border border-radius-xl shadow-2xl shadow-primary object-cover" :class="`fi ${lang.icon}`" style="width: 32px; height:26px;" />
        </template>
        <v-list-item-title class="ms-2">
          {{ lang.name }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
