<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
      </teleport>
    </client-only>
    <h1 :class="isDark ? 'text-white' : 'text-default'">Order history</h1>
    <p class="text-secondary">Browse your orders from the past</p>

    <v-skeleton-loader v-if="loading" type="table" class="mx-4 my-6" />

    <v-card v-else rounded="xl" class="py-4" variant="text" elevation="10">
      <v-card-text>
        <v-data-table
          class="bg-transparent custom-table"
          :headers="headers"
          :items="orders"
          :search="search"
          :items-per-page="5"
          :items-per-page-options="[5, 10, 20, 50, 100]"
          item-value="id"
          density="comfortable"
        >
          <template #item="{ item }">
            <tr>
              <td v-for="(header, index) in headers" :key="header.key || index">
                <template v-if="header.type === 'chip'">
                  <v-chip color="success">
                    {{ getNestedValue(item, header.key) }}
                  </v-chip>
                </template>
                <template v-else>
                  {{ getNestedValue(item, header.key) }}
                </template>
              </td>
              <td class="text-end">
                <v-btn
                  color="default"
                  variant="text"
                  icon="mdi-eye"
                  v-tooltip="{ text: 'Show' }"
                  @click="view(item.number)"
                />
                <v-btn color="primary" v-if="item.state === 'New'" variant="outlined" v-tooltip="{ text: 'Pay' }">💳 Pay</v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script lang="ts" setup>

import { ref, computed, onMounted, nextTick } from 'vue'
import type {DataTableHeaders} from "~/plugins/vuetify";

const search = ref('')
const loading = ref(true)
const headers: DataTableHeaders = [
  { title: 'ID', key: 'number' , list: true, show: true ,create: false, edit: true },
  { title: 'Date', key: 'date' , list: true, show: true ,create: false, edit: true },
  { title: 'Customer', key: 'shipTo' , list: true, show: true ,create: false, edit: true },
  { title: 'Total', key: 'total' , list: true, show: true ,create: false, edit: true },
  { title: 'State', key: 'state' , type: 'chip', list: true, show: true ,create: false, edit: true },
  { title: '', key: 'actions', list: false, show: false ,create: false, edit: false,  sortable: false, align: 'end' },
]
const canTeleport = ref(false)
const orders = [
  {
    number: '000000003',
    date: '07/16/2025',
    shipTo: 'asd asdada',
    total: 65.62,
    state: 'New',
  },
  {
    number: '000000002',
    date: '07/12/2025',
    shipTo: 'xxyvcv yxvyxcv',
    total: 136.10,
    state: 'New',
  },
  {
    number: '000000001',
    date: '07/12/2025',
    shipTo: 'rami aouinti',
    total: 87.87,
    state: 'New',
  },
]
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}
const view = (number) => {
  alert('View order #' + number)
}
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await nextTick()
  canTeleport.value = !!document.getElementById('menu-bar-world')
  loading.value = false
})
</script>

<style scoped>
::v-deep(.v-data-table thead tr th) {
  background-color: transparent !important;
}
::v-deep(.v-data-table td .v-input--checkbox) {
  margin-top: -8px; /* Ajuste selon besoin */
  vertical-align: middle;
}
::v-deep(.v-data-table td .v-input--checkbox .v-checkbox-btn) {
  align-items: center;
  padding-top: 0;
  padding-bottom: 0;
}
.checkbox-align ::v-deep(.v-input--checkbox .v-checkbox-btn) {
  align-items: center;
  margin-top: -6px;
}
h1 {
  margin-bottom: 0;
}
p {
  margin-bottom: 20px;
  color: #666;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}
thead th {
  text-align: left;
  background: #f9f9f9;
  padding: 12px;
  font-weight: 600;
}
tbody td {
  padding: 12px;
  border-top: 1px solid #eee;
}
.badge.green {
  background: #1abc9c;
  color: white;
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 13px;
}
button {
  background: #f2f2f2;
  border: none;
  padding: 6px 12px;
  margin-right: 4px;
  border-radius: 4px;
  cursor: pointer;
}
.pay-btn {
  background: #1abc9c;
  color: white;
}
</style>
