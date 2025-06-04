import { en, fr, de, ar } from 'vuetify/locale'
import { useNuxtApp } from '#app'
import { useI18n } from 'vue-i18n'

export default defineNuxtPlugin(() => {
  const { $i18n } = useNuxtApp()
  const availableLocales = {
    en,
    fr,
    de,
    ar,
  }

  for (const [code, messages] of Object.entries(availableLocales)) {
    $i18n.setLocaleMessage(code, {
      ...$i18n.getLocaleMessage(code),
      $vuetify: messages,
    })
  }
})
