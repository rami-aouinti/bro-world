<!-- components/cv/SectionSettingsMenu.vue -->
<template>
  <v-menu
    v-model="openLocal"
    :close-on-content-click="false"
    :open-on-click="!hideActivator"
    persistent
    transition="scale-transition"
    location="bottom-end"
    :activator="menuActivator"
  >
    <!-- Fallback activator (hidden when hideActivator or a custom activator is provided) -->
    <template #activator v-if="!hideActivator && !activator">
      <v-btn
        variant="outlined"
        size="small"
        class="rounded-xl text-none px-4"
        @click.stop="openLocal = true"
      >
        <v-icon start icon="mdi-tune-variant" />
        Settings
      </v-btn>
    </template>

    <v-card class="pa-0" elevation="8" rounded="xl" :width="hasList ? 350 : 300">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between px-4 py-3">
        <div class="text-subtitle-1 font-weight-600 d-flex align-center">
          <v-icon  :icon="activeSection?.icon || 'mdi-tune-variant'" />
          {{ activeSection?.label || 'Settings' }}
        </div>
        <v-btn icon variant="text" size="small" :ripple="false" @click.stop="openLocal = false">
          <v-icon icon="mdi-close" />
        </v-btn>
      </div>
      <v-divider />

      <v-row class="ma-0">
        <!-- Sections list (only when > 1) -->
        <v-col
          v-if="hasList"
          cols="3"
          class="pa-3"
          style="border-right: 1px solid rgba(0,0,0,.06);"
        >
          <v-list nav density="compact">
            <v-list-item
              v-for="s in sectionsList"
              :key="s.key"
              :active="s.key === activeKey"
              @click="setActive(s.key)"
            >
              <template #prepend><v-icon :icon="s.icon" /></template>
              <!-- optional title: <v-list-item-title class="text-body-2">{{ s.label }}</v-list-item-title> -->
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Panel -->
        <v-col :cols="hasList ? 9 : 12" class="pa-3">
          <v-slide-x-transition mode="out-in">
            <div :key="activeKey">
              <template v-if="fields.length">
                <v-row class="ma-0" dense>
                  <v-col
                    v-for="f in fields"
                    :key="f.key"
                    class="pb-2"
                    :cols="f.cols ?? 12"
                    :xs="f.xs ?? f.cols ?? 12"
                    :sm="f.sm"
                    :md="f.md"
                    :lg="f.lg"
                    :xl="f.xl"
                  >
                    <!-- SWITCH -->
                    <template v-if="f.type === 'switch'">
                      <div class="d-flex align-center justify-center">
                        <v-switch
                          hide-details density="compact"
                          :model-value="read(activeKey, f.key)"
                          @update:modelValue="val => write(activeKey, f.key, val)"
                        />
                        <div class="text-body-2 mx-2">{{ f.label }}</div>
                      </div>
                    </template>

                    <!-- SLIDER -->
                    <template v-else-if="f.type === 'slider'">
                      <div class="text-body-2 mb-1">{{ f.label }}</div>
                      <v-number-input
                        :reverse="false"
                        controlVariant="split"
                        density="compact"
                        variant="outlined"
                        label=""
                        :hideInput="false"
                        :min="f.min" :max="f.max" :step="f.step || 1"
                        :model-value="read(activeKey, f.key)"
                        @update:modelValue="val => write(activeKey, f.key, val)"
                      ></v-number-input>

                    </template>

                    <!-- SELECT -->
                    <template v-else-if="f.type === 'select'">
                      <div class="text-body-2 mb-1">{{ f.label }}</div>
                      <v-select
                        hide-details density="compact"
                        :items="f.items || []" item-title="title" item-value="value"
                        :model-value="read(activeKey, f.key)"
                        @update:modelValue="val => write(activeKey, f.key, val)"
                      />
                    </template>

                    <!-- SEGMENTED -->
                    <template v-else-if="f.type === 'segmented'">
                      <div class="text-body-2 mb-1">{{ f.label }}</div>
                      <v-item-group
                        :model-value="read(activeKey, f.key)"
                        @update:modelValue="val => write(activeKey, f.key, val)"
                        mandatory density="compact"
                      >
                        <div class="d-flex flex-wrap">
                          <v-item
                            v-for="opt in f.options || []"
                            :key="String(opt.value)"
                            :value="opt.value"
                            v-slot="{ isSelected, toggle }"
                          >
                            <v-btn
                              size="small" class="ma-1 text-none px-2 py-1"
                              :variant="isSelected ? 'elevated' : 'text'"
                              :class="isSelected ? 'border border-radius-xl border-secondary border-md shadow-2xl shadow-primary'
                                                  : 'border border-radius-xl border-secondary border-md'"
                              @click="toggle"
                            >
                              <v-icon v-if="opt.icon" start :icon="opt.icon" />
                              {{ opt.label ?? opt.value }}
                            </v-btn>
                          </v-item>
                        </div>
                      </v-item-group>
                    </template>

                    <!-- SWATCHES -->
                    <template v-else-if="f.type === 'swatches'">
                      <div class="text-body-2 mb-1">{{ f.label || 'Accent' }}</div>
                      <v-item-group
                        :model-value="read(activeKey, f.key)"
                        @update:modelValue="val => write(activeKey, f.key, val)"
                        mandatory
                      >
                        <div class="d-flex flex-wrap">
                          <v-item
                            v-for="c in (f.colors || swatchesList)"
                            :key="c" :value="c" v-slot="{ isSelected, toggle }"
                          >
                            <v-btn
                              class="ma-1" :class="isSelected ? 'elevation-12' : ''"
                              size="small"
                              :style="{
                                backgroundColor: c, borderRadius: '8px',
                                minWidth: '28px', width: '28px', height: '28px'
                              }"
                              :elevation="isSelected ? 8 : 1"
                              @click="toggle"
                            />
                          </v-item>
                        </div>
                      </v-item-group>
                    </template>

                    <!-- BUTTON -->
                    <template v-else-if="f.type === 'button'">
                      <v-btn
                        block :color="f.color || 'primary'" variant="outlined" class="text-none"
                        @click="$emit('action', activeKey, f.action || f.key)"
                      >
                        <v-icon v-if="f.icon" start :icon="f.icon" />
                        {{ f.label }}
                      </v-btn>
                    </template>
                  </v-col>
                </v-row>
              </template>

              <template v-else>
                <div class="text-caption text-medium-emphasis">
                  No setting for this section.
                </div>
              </template>
            </div>
          </v-slide-x-transition>
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>
<style scoped>
.num-sm .v-field__input { padding-block: 6px; }
</style>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'

type SegOpt = { value: any; label?: string; icon?: string }

/** Common layout props to allow multiple fields per row */
type BaseField = {
  key: string
  label?: string
  cols?: number
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

type Field =
  | ({ type: 'switch' } & BaseField)
  | ({ type: 'slider'; min: number; max: number; step?: number } & BaseField)
  | ({ type: 'select'; items: Array<{ title: string; value: any }> } & BaseField)
  | ({ type: 'segmented'; options: SegOpt[] } & BaseField)
  | ({ type: 'swatches'; colors?: string[] } & BaseField)
  | ({ type: 'button'; action?: string; icon?: string; color?: string } & BaseField)

type SectionCfg = { key: string; label: string; icon?: string; fields: Field[] }

const props = defineProps<{
  sections: SectionCfg[]
  bindings: Record<string, any>
  swatches?: string[]
  modelValue?: boolean
  active?: string
  hideActivator?: boolean
  /** Optional external activator (Element or selector) */
  activator?: Element | string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'action', sectionKey: string, actionKey: string): void
  (e: 'changed', sectionKey: string, fieldKey: string, value: any): void
}>()

/* open */
const openLocal = computed({
  get: () => props.modelValue ?? false,
  set: v  => emit('update:modelValue', v),
})

/* activator for v-menu */
const menuActivator = computed(() => props.activator || undefined)

/* sections + active */
const sectionsList = computed(() => props.sections || [])
const hasList      = computed(() => (sectionsList.value?.length || 0) > 1)
const swatchesList = computed(() => props.swatches || [
  '#1E88E5','#43A047','#8E24AA','#37474F','#0D47A1',
  '#FB8C00','#E53935','#D81B60','#3949AB','#4E342E'
])

const activeKey = ref(props.active || sectionsList.value?.[0]?.key || '')
watch([() => props.active, sectionsList], () => {
  const keys = new Set((sectionsList.value || []).map(s => s.key))
  if (!keys.has(activeKey.value)) {
    activeKey.value = props.active && keys.has(props.active)
      ? props.active
      : sectionsList.value?.[0]?.key || ''
  }
}, { immediate: true })

const activeSection = computed(() => sectionsList.value.find(s => s.key === activeKey.value))
const fields        = computed(() => activeSection.value?.fields || [])

function setActive(key: string) { activeKey.value = key }

/* generic get / set */
function read(sectionKey: string, fieldKey: string) {
  const obj = props.bindings?.[sectionKey]
  return obj ? obj[fieldKey] : undefined
}
function write(sectionKey: string, fieldKey: string, value: any) {
  const obj = props.bindings?.[sectionKey]
  if (obj) {
    obj[fieldKey] = value
    emit('changed', sectionKey, fieldKey, value)
  }
}
</script>
