<template>
  <v-container fluid class="pa-4">
    <v-row>
      <!-- Left TreeView -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" class="pa-4">
          <v-toolbar
            color="transparent"
          >
            <v-app-bar-nav-icon color="primary"></v-app-bar-nav-icon>
            <v-toolbar-title text="Category"></v-toolbar-title>
            <v-btn @click="handleSubmit = true" color="primary" icon="mdi-plus"></v-btn>
          </v-toolbar>
          <TaxonTree :items="internalItems" @edit="handleEdit" @update:items="onUpdate" />
        </v-card>
      </v-col>

      <!-- Right Form -->
      <v-col cols="12" md="8">
        <v-card rounded="xl" class="pa-4 mb-4">
          <h3 class="text-h6 font-weight-bold mb-4">General</h3>
          <v-text-field v-model="form.code" label="Code" required />
          <v-select v-model="form.parent" :items="flattenedItems" label="Parent" item-title="name" item-value="id" />
          <v-switch v-model="form.enabled" label="Enabled" color="primary" />
        </v-card>

        <v-card rounded="xl" class="pa-4 mb-4">
          <h3 class="text-h6 font-weight-bold mb-4">Translations</h3>
          <v-expansion-panels multiple>
            <v-expansion-panel
              v-for="lang in languages"
              :key="lang.code"
              class="rounded-xl elevation-0"
            >
              <v-expansion-panel-title class="font-weight-bold">
                {{ lang.label }} ({{ lang.nativeName }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col cols="6">
                    <v-text-field v-model="form.translations[lang.code].name" label="Name" required />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.translations[lang.code].slug"
                      label="Slug"
                      append-inner-icon="mdi-wand"
                      @click:append-inner="() => generateSlug(lang.code)"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="form.translations[lang.code].description" label="Description" />
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>

        <v-card rounded="xl" class="pa-4">
          <h3 class="text-h6 font-weight-bold mb-4">Media</h3>
          <v-file-input
            v-model="form.image"
            label="Add image"
            accept="image/*"
            prepend-icon="mdi-image"
            show-size
            variant="outlined"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import TaxonTree from '~/components/Ecommerce/TaxonTree.vue'

const emit = defineEmits(['update:items', 'edit'])
const languages = [
  { code: 'en', label: 'English', nativeName: 'United States' }
]

const props = defineProps<{
  taxons: any[]
}>()

const form = reactive({
  code: '',
  parent: null,
  enabled: true,
  image: null,
  translations: Object.fromEntries(
    languages.map(lang => [
      lang.code,
      { name: '', slug: '', description: '' },
    ])
  ),
})

const internalItems = ref([...props.taxons])

watch(
  () => props.taxons,
  (val) => {
    internalItems.value = [...val]
  },
  { deep: true }
)

function handleEdit(taxon: any) {
  console.log('Edit taxon:', taxon)
}

function onMove(e: any) {
  return true
}

function onUpdate() {
  emit('update:items', internalItems.value)
}

const flattenedItems = computed(() => {
  const result: any[] = []
  const flatten = (list: any[], prefix = '') => {
    list.forEach(item => {
      result.push({ id: item.ref || item.id, name: `${prefix}${item.name}` })
      if (item.children) flatten(item.children, `${prefix}${item.name} > `)
    })
  }
  flatten(internalItems.value)
  return result
})

function generateSlug(langCode: string) {
  const name = form.translations[langCode].name
  form.translations[langCode].slug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^\-+|\-+$/g, '')
}

async function handleSubmit() {
  const payload = buildTaxonPayload(form)
  try {
    await $fetch('/api/admin/shop/catalog/taxons/create/taxon', {
      method: 'POST',
      body: payload,
    })
    Notify.success('✅ Taxon created successfully!')
    resetForm()
  } catch (error) {
    console.error('❌ Failed to create taxon:', error)
    alert('❌ Error creating taxon')
  }
}

function buildTaxonPayload(form: any): any {
  const translations: any = {}
  for (const [code, value] of Object.entries(form.translations)) {
    translations[code.replace('-', '_') + '_US'] = {
      name: value.name,
      slug: value.slug,
      description: value.description || '',
    }
  }
  return {
    code: form.code,
    parent: form.parent ? `${form.parent}` : null,
    enabled: form.enabled,
    translations,
  }
}

function resetForm() {
  form.code = ''
  form.parent = null
  form.enabled = true
  form.image = null
  for (const lang of languages) {
    form.translations[lang.code] = { name: '', slug: '', description: '' }
  }
}
</script>
