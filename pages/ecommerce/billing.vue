<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
      </teleport>
    </client-only>
    <h1 :class="isDark ? 'text-white' : 'text-default'">Billing</h1>

    <v-skeleton-loader v-if="loading" type="table" class="mx-4 my-6" />

    <v-row class="px-4">
      <v-col lg="8">
        <v-row>
          <v-col lg="6">
            <v-card class="card-shadow border-radius-xl">
              <div class="overflow-hidden position-relative border-radius-xl">
                <v-img
                  src="/img/illustrations/pattern-tree.svg"
                  class="
                    position-absolute
                    opacity-2
                    start-0
                    top-0
                    w-100
                    z-index-1
                    h-100
                  "
                />
                <span class="mask bg-gradient-default opacity-10"></span>
                <div class="px-4 py-4 position-relative">
                  <i class="fas fa-wifi text-white pa-2" aria-hidden="true"></i>
                  <h5 class="text-white mt-6 mb-12 pb-2 text-h5">
                    4562&nbsp;&nbsp;&nbsp;1122&nbsp;&nbsp;&nbsp;4594&nbsp;&nbsp;&nbsp;7852
                  </h5>
                  <div class="d-flex">
                    <div class="d-flex">
                      <div class="me-4">
                        <p
                          class="
                            text-white text-sm
                            font-weight-light
                            opacity-8
                            mb-0
                          "
                        >
                          Card Holder
                        </p>
                        <h6 class="text-white text-h6 mb-0">Jack Peterson</h6>
                      </div>
                      <div>
                        <p
                          class="
                            text-white text-sm
                            font-weight-light
                            opacity-8
                            mb-0
                          "
                        >
                          Expires
                        </p>
                        <h6 class="text-white text-h6 mb-0">11/22</h6>
                      </div>
                    </div>
                    <div
                      class="
                        ms-auto
                        w-10
                        d-flex
                        align-items-end
                        justify-content-end
                        mt-auto
                      "
                    >
                      <v-img
                        src="/img/logos/mastercard.png"
                        alt="logo"
                        width="22"
                        height="22"
                        contain
                      ></v-img>
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col lg="6">
            <v-row>
              <v-col md="6">
                <v-card class="card-shadow border-radius-xl">
                  <div class="mx-6 pa-4 text-center">
                    <v-avatar
                      color="bg-gradient-primary"
                      class="shadow border-radius-lg"
                      width="64"
                      height="64"
                      min-width="64"
                    >
                      <v-icon size="24" class="text-white material-icons-round">
                        account_balance
                      </v-icon>
                    </v-avatar>
                  </div>
                  <div class="px-4 pb-4 text-center">
                    <h6
                      class="
                        text-center text-h6
                        mb-0
                        text-typo
                        font-weight-bold
                      "
                    >
                      Salary
                    </h6>
                    <span class="text-xs text-body">Belong Interactive</span>
                    <hr class="horizontal dark my-4" />
                    <h5 class="mb-0 text-h5 font-weight-bold text-typo">
                      +$2000
                    </h5>
                  </div>
                </v-card>
              </v-col>
              <v-col md="6">
                <v-card class="card-shadow border-radius-xl">
                  <div class="mx-6 pa-4 text-center">
                    <v-avatar
                      color="bg-gradient-primary"
                      class="shadow border-radius-lg"
                      width="64"
                      height="64"
                      min-width="64"
                    >
                      <v-icon size="24" class="text-white material-icons-round">
                        account_balance_wallet
                      </v-icon>
                    </v-avatar>
                  </div>
                  <div class="px-4 pb-4 text-center">
                    <h6
                      class="
                        text-center text-h6
                        mb-0
                        text-typo
                        font-weight-bold
                      "
                    >
                      Paypal
                    </h6>
                    <span class="text-xs text-body">Freelance Payment</span>
                    <hr class="horizontal dark my-4" />
                    <h5 class="mb-0 text-h5 font-weight-bold text-typo">
                      $455.00
                    </h5>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col md="12">
            <v-card class="card-shadow border-radius-xl">
              <div class="px-4 py-4 d-flex align-center">
                <h6 class="mb-0 text-typo text-h6 font-weight-bold">
                  Payment Method
                </h6>
                <v-btn
                  :ripple="false"
                  elevation="0"
                  color="#fff"
                  class="
                    font-weight-bolder
                    btn-default
                    bg-gradient-default
                    py-5
                    px-6
                    ms-auto
                  "
                  small
                >
                  <v-icon class="me-2" size="12">mdi-plus</v-icon>
                  Add new card
                </v-btn>
              </div>
              <div class="px-4 pb-4">
                <v-row>
                  <v-col md="6">
                    <div class="pa-5 border border-radius-lg d-flex">
                      <v-avatar size="36" rounded class="me-4">
                        <v-img
                          src="/img/logos/mastercard.png"
                          alt="logo"
                          max-width="80"
                          contain
                        ></v-img>
                      </v-avatar>
                      <h6 class="mb-0 text-h6 text-typo mt-2">
                        ****&nbsp;&nbsp;&nbsp;****&nbsp;&nbsp;&nbsp;****&nbsp;&nbsp;&nbsp;7852
                      </h6>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on" size="16">
                            fas fa-pencil-alt ms-auto text-dark cursor-pointer
                          </v-icon>
                        </template>
                        <span>Edit Card</span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col md="6">
                    <div class="pa-5 border border-radius-lg d-flex">
                      <v-avatar size="36" rounded class="me-4">
                        <v-img
                          src="/img/logos/visa.png"
                          alt="logo"
                          max-width="80"
                          contain
                        ></v-img>
                      </v-avatar>
                      <h6 class="mb-0 text-h6 text-typo mt-2">
                        ****&nbsp;&nbsp;&nbsp;****&nbsp;&nbsp;&nbsp;****&nbsp;&nbsp;&nbsp;5248
                      </h6>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on" size="16">
                            fas fa-pencil-alt ms-auto text-dark cursor-pointer
                          </v-icon>
                        </template>
                        <span>Edit Card</span>
                      </v-tooltip>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col lg="4">
        <v-card class="card-shadow border-radius-xl">
          <div class="px-4 pt-4 d-flex align-center">
            <h6 class="mb-0 text-h6 font-weight-bold text-typo">Invoices</h6>
            <v-btn
              :ripple="false"
              elevation="0"
              color="#fff"
              class="font-weight-bolder btn-outline-primary ms-auto"
              small
            >
              View all
            </v-btn>
          </div>
          <div class="px-4 pb-3 pt-3">
            <div v-for="invoice in invoices" :key="invoice.date">
              <v-list-item
                :key="invoice.id"
                class="px-0 pt-2 pb-3 justify-between"
              >
                <v-list-item-content class="py-0">
                  <div class="d-flex flex-column">
                    <h6 class="mb-1 text-dark font-weight-bold text-sm">
                      {{ invoice.date }}
                    </h6>
                    <span class="text-xs text-body">{{ invoice.id }}</span>
                  </div>
                </v-list-item-content>

                <v-list-item-content class="py-0 text-end">
                  <div class="d-flex align-center text-sm text-body">
                    <span class="ms-auto">{{ invoice.value }}</span>
                    <v-btn
                      color="#fff"
                      class="text-dark font-weight-bolder py-6 px-5 shadow-0"
                      small
                      simple
                    >
                      <v-icon
                        size="18"
                        class="rotate-180 material-icons-round text-lg me-2"
                      >mdi-pdf</v-icon
                      >
                      Pdf
                    </v-btn>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="px-4">
      <v-col md="7">
        <v-card class="card-shadow border-radius-xl">
          <div class="px-4 pt-5">
            <h6 class="mb-0 text-typo text-h6 font-weight-bold">
              Billing Information
            </h6>
          </div>
          <div class="px-4 pt-6 pb-1">
            <div v-for="billing in billings" :key="billing.name">
              <v-list-item
                :key="billing.vat"
                class="px-0 py-3 bg-gray-100 border-radius-lg p-6 mb-6"
              >
                <v-list-item-content class="px-6">
                  <div class="d-flex flex-column">
                    <h6 class="mb-3 text-sm text-typo font-weight-bold">
                      {{ billing.name }}
                    </h6>
                    <span class="mb-2 text-xs text-body"
                    >Company Name:
                      <span class="text-dark font-weight-bold ms-sm-2">{{
                          billing.company
                        }}</span></span
                    >
                    <span class="mb-2 text-xs text-body"
                    >Email Address:
                      <span class="text-dark ms-sm-2 font-weight-bold">{{
                          billing.email
                        }}</span></span
                    >
                    <span class="text-xs text-body"
                    >VAT Number:
                      <span class="text-dark ms-sm-2 font-weight-bold">{{
                          billing.vat
                        }}</span></span
                    >
                  </div>
                </v-list-item-content>

                <v-list-item-content class="py-0 text-end">
                  <div class="d-flex align-center text-sm text-body">
                    <v-btn
                      :ripple="false"
                      color="transparent"
                      class="
                        text-danger
                        font-weight-bolder
                        shadow-0
                        ms-auto
                      "
                      small
                      simple
                    >
                      <v-icon size="12" class="me-2 material-icons-round"
                      >mdi-delete</v-icon
                      >
                      Delete
                    </v-btn>
                    <v-btn
                      :ripple="false"
                      color="transparent"
                      class="text-dark font-weight-bolder shadow-0"
                      small
                      simple
                    >
                      <v-icon size="12" class="me-2 material-icons-round"
                      >mdi-edit</v-icon
                      >
                      Edit
                    </v-btn>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col md="5">
        <v-card class="card-shadow border-radius-xl h-100">
          <div class="px-4 pt-5 d-flex align-center">
            <h6 class="mb-0 text-typo text-h6 font-weight-bold">
              Your Transaction's
            </h6>
            <div class="text-body ms-auto">
              <v-icon class="text-body" size="16"
              >far fa-calendar-alt me-2</v-icon
              >
              <small>23 - 30 March 2020</small>
            </div>
          </div>
          <div class="px-4 pt-6">
            <h6
              class="text-uppercase text-body text-xs font-weight-bolder mb-3"
            >
              Newest
            </h6>
            <div v-for="transaction in transactions1" :key="transaction.title">
              <v-list-item :key="transaction.title" class="px-0 py-3">
                <v-btn
                  :ripple="false"
                  icon
                  outlined
                  rounded
                  :color="transaction.color"
                  width="34px"
                  height="34px"
                >
                  <v-icon size="18" class="material-icons-round">{{
                      transaction.icon
                    }}</v-icon>
                </v-btn>

                <v-list-item-content class="py-0">
                  <div class="d-flex flex-column">
                    <h6 class="mb-1 text-typo text-sm font-weight-bold">
                      {{ transaction.title }}
                    </h6>
                    <span class="text-xs text-body">{{
                        transaction.date
                      }}</span>
                  </div>
                </v-list-item-content>

                <v-list-item-content class="py-0 text-end">
                  <div
                    :class="transaction.gradient"
                    class="text-sm font-weight-bold text-gradient"
                  >
                    {{ transaction.value }}
                  </div>
                </v-list-item-content>
              </v-list-item>
            </div>
            <h6
              class="
                text-uppercase text-body text-xs
                font-weight-bolder
                mt-4
                mb-3
              "
            >
              Yesterday
            </h6>
            <div v-for="transaction in transactions2" :key="transaction.title">
              <v-list-item :key="transaction.title" class="px-0 py-3">
                <v-btn
                  :ripple="false"
                  icon
                  outlined
                  rounded
                  :color="transaction.color"
                  width="34px"
                  height="34px"
                >
                  <v-icon size="18" class="material-icons-round">{{
                      transaction.icon
                    }}</v-icon>
                </v-btn>

                <v-list-item-content class="py-0">
                  <div class="d-flex flex-column">
                    <h6 class="mb-1 text-typo text-sm font-weight-bold">
                      {{ transaction.title }}
                    </h6>
                    <span class="text-xs text-body">{{
                        transaction.date
                      }}</span>
                  </div>
                </v-list-item-content>

                <v-list-item-content class="py-0 text-end">
                  <div
                    :class="transaction.gradient"
                    class="text-sm font-weight-bold text-gradient"
                  >
                    {{ transaction.value }}
                  </div>
                </v-list-item-content>
              </v-list-item>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts" setup>

import { ref, computed, onMounted, nextTick } from 'vue'
import type {DataTableHeaders} from "~/plugins/vuetify";

const search = ref('')
const loading = ref(true)
const invoices = ref([
  {
    date: "March, 01, 2020",
    id: "#MS-415646",
    value: "$180",
  },
  {
    date: "February, 10, 2021",
    id: "#RV-126749",
    value: "$250",
  },
  {
    date: "April, 05, 2020",
    id: "#FB-212562",
    value: "$560",
  },
  {
    date: "June, 25, 2019",
    id: "#QW-103578",
    value: "$120",
  },
  {
    date: "March, 01, 2019",
    id: "#AR-803481",
    value: "$300",
  },
],)
const  billings= ref( [
  {
    name: "Oliver Liam",
    company: "Viking Burrito",
    email: "oliver@burrito.com",
    vat: "FRB1235476",
  },
  {
    name: "Lucas Harper",
    company: "Stone Tech Zone",
    email: "lucas@stone-tech.com",
    vat: "FRB1235476",
  },
  {
    name: "Fiber Notion",
    company: "Stone Tech Zone",
    email: "ethan@fiber.com",
    vat: "FRB1235476",
  },
])
const  transactions1= ref( [
  {
    icon: "mdi-more",
    color: "#ea0606",
    title: "Netflix",
    date: "27 March 2020, at 12:30 PM",
    value: "- $ 2,500",
    gradient: "text-danger",
  },
  {
    icon: "mdi-less",
    color: "#82d616",
    title: "Apple",
    date: "23 March 2020, at 04:30 AM",
    value: "+ $ 2,000",
    gradient: "text-success",
  },
])
const  transactions2= ref( [
  {
    icon: "expand_more",
    color: "#82d616",
    title: "Stripe",
    date: "26 March 2020, at 13:45 PM",
    value: "+ $ 750",
    gradient: "text-success",
  },
  {
    icon: "expand_more",
    color: "#82d616",
    title: "HubSpot",
    date: "26 March 2020, at 12:30 PM",
    value: "+ $ 1,000",
    gradient: "text-success",
  },
  {
    icon: "expand_more",
    color: "#82d616",
    title: "Creative Tim",
    date: "26 March 2020, at 08:30 AM",
    value: "+ $ 2,500",
    gradient: "text-success",
  },
  {
    icon: "priority_high",
    color: "#344767",
    title: "Webflow",
    date: "26 March 2020, at 05:00 AM",
    value: "Pending",
    gradient: "text-default",
  },
])
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
