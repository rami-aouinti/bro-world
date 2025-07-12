<script setup lang="ts">
import {nextTick, onMounted, ref, watch } from 'vue'
import TaxonForm from "~/components/Ecommerce/TaxonForm.vue";
import { buildTaxonTree } from '~/composables/useTaxons'
definePageMeta({
  icon: 'mdi-products',
  title: 'Taxons',
  requiresAdmin: true,
  drawerIndex: 0,
})
const loading = ref(true)
const taxons = ref<any[]>([])
const loadTaxons = async () => {
  try {
    const raw = await $fetch('/api/admin/shop/catalog/taxons/taxons', { responseType: 'text' })
    const fixedRaw = raw.trim().match(/^\{.*\}/s)?.[0]
    if (!fixedRaw) throw new Error('Invalid JSON format')
    const data = JSON.parse(fixedRaw)
    const category = buildTaxonTree(data['hydra:member'], 'en_US')
    taxons.value = category[0].children
    loading.value = true
  } catch (e) {
    console.error('❌ Erreur de chargement des produits:', e)
  } finally {
    loading.value = false
  }
}
function buildCategoryTree(raw: any[]) {
  const map = new Map()
  raw.forEach(cat => {
    if (!map.has(cat.id)) {
      map.set(cat.id, { ...cat, children: [] })
    }
  })

  const tree = []

  map.forEach(cat => {
    if (cat.parent && map.has(cat.parent)) {
      map.get(cat.parent).children.push(cat)
    } else {
      tree.push(cat)
    }
  })

  return tree
}
watch(loading, async () => {
  await loadTaxons()
}, { immediate: true })
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await loadTaxons()
  await nextTick()
})
</script>
<template>
  <v-container fluid>
    <TaxonForm :taxons="taxons"
    />
  </v-container>
</template>

