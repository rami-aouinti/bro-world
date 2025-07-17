<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="pa-2">
          <h1 :class="isDark ? 'text-white' : 'text-default'">Thank you!</h1>
          <p :class="isDark ? 'text-white' : 'text-default'">You have successfully placed an order.</p>
          <v-btn variant="outlined" color="primary" to="/ecommerce/orderDetails">View order</v-btn>
        </div>
      </teleport>
    </client-only>
    <v-card rounded="xl" class="bg-gradient-primary shadow-primary" variant="text" elevation="10">
      <div id="print-zone" class="printable">
        <div class="px-6 py-6">
          <v-row>
            <v-col md="4" align-self="start">
              <v-img
                src="/img/logo-ct.png"
                width="50"
                contain
                class="pa-2 mb-2"
              ></v-img>
              <h6 class="text-typo text-h6 font-weight-bold mb-2">
                St. Independence Embankment, 050105 Bucharest, Romania
              </h6>
              <p class="d-block text-secondary font-weight-light">
                tel: +4 (074) 1090873
              </p>
            </v-col>
            <v-col lg="3" md="7" class="text-md-end mt-8 ms-auto">
              <h6
                class="
                      d-block
                      mt-2
                      mb-0
                      text-typo text-h6
                      font-weight-bold
                      mb-2
                    "
              >
                Billed to: John Doe
              </h6>
              <p class="text-secondary font-weight-light">
                4006 Locust View Drive<br />
                San Francisco CA<br />
                California
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="4" class="mt-auto py-0">
              <h6
                class="
                      mb-0
                      text-start text-h6
                      font-weight-normal
                      text-secondary
                    "
              >
                Invoice no
              </h6>
              <h5
                class="text-start text-typo text-h5 font-weight-bold mb-0"
              >
                #0453119
              </h5>
            </v-col>
            <v-col lg="5" md="7" class="mt-auto ms-auto">
              <v-row class="mt-md-5 mt-4 text-md-end text-start">
                <v-col md="6" class="py-0">
                  <h6
                    class="text-secondary text-h6 font-weight-normal mb-0"
                  >
                    Invoice date:
                  </h6>
                </v-col>
                <v-col md="6" class="py-0">
                  <h6 class="text-dark text-h6 font-weight-bold mb-0">
                    06/03/2019
                  </h6>
                </v-col>
                <v-col md="6" class="py-0">
                  <h6
                    class="text-secondary text-h6 font-weight-normal mb-0"
                  >
                    Due date:
                  </h6>
                </v-col>
                <v-col md="6" class="py-0">
                  <h6 class="text-dark text-h6 font-weight-bold mb-0">
                    11/03/2019
                  </h6>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div class="px-6 py-6">
          <v-row>
            <v-col cols="12">
              <v-data-table :items-per-page="items.length"
                            hide-default-footer class="bg-transparent custom-table">
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th class="ps-1">
                      <p
                        class="
                                mb-0
                                text-body text-capitalize text-md
                                font-weight-bold
                              "
                      >
                        Item
                      </p>
                    </th>
                    <th class="pe-2">
                      <p
                        class="
                                mb-0
                                text-body text-capitalize text-md
                                font-weight-bold
                              "
                      >
                        Qty
                      </p>
                    </th>
                    <th class="pe-2">
                      <p
                        class="
                                mb-0
                                text-body text-capitalize text-md
                                font-weight-bold
                              "
                      >
                        Rate
                      </p>
                    </th>
                    <th class="pe-2">
                      <p
                        class="
                                mb-0
                                text-body text-capitalize text-md
                                font-weight-bold
                              "
                      >
                        Amount
                      </p>
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, i) in items" :key="item.title">
                    <td
                      class="text-secondary mb-0 py-3 ps-1"
                      :class="{ 'border-bottom': i != items.length - 1 }"
                    >
                      <p class="text-md mb-0">{{ item.title }}</p>
                    </td>
                    <td class="ps-4 text-secondary">
                      <p class="text-md mb-0">{{ item.qty }}</p>
                    </td>
                    <td class="ps-4 text-secondary">
                      <p class="text-md mb-0">{{ item.rate }}</p>
                    </td>
                    <td class="ps-4 text-secondary">
                      <p class="text-md mb-0">{{ item.amount }}</p>
                    </td>
                  </tr>
                  </tbody>
                  <tfoot>
                  <tr>
                    <th class="ps-1"></th>
                    <th class="pe-2"></th>
                    <th class="pe-2">
                      <p class="mb-0 text-h5 text-typo font-weight-bold">
                        Total
                      </p>
                    </th>
                    <th class="pe-2">
                      <p class="mb-0 text-h5 text-typo font-weight-bold">
                        $698
                      </p>
                    </th>
                  </tr>
                  </tfoot>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </div>
        <div class="px-6 py-6 mt-md-8 mt-6">
          <v-row>
            <v-col lg="5" class="text-start">
              <h5 class="text-h5 mb-2 text-typo font-weight-bold">
                Thank you!
              </h5>
              <p class="text-secondary font-weight-light text-sm">
                If you encounter any issues related to the invoice you can
                contact us at:
              </p>
              <h6 class="text-secondary text-h6 font-weight-normal mb-0">
                email:
                <span class="text-dark">support@creative-tim.com</span>
              </h6>
            </v-col>
            <v-col lg="7" class="text-end d-flex">
              <v-btn
                variant="outlined"
                color="primary"
                class="
                      mt-auto
                      ms-auto
                    "
                @click="generatePDF"
              >
                Print
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import html2pdf from 'html2pdf.js'

function generatePDF() {
  const element = document.getElementById('print-zone')
  const opt = {
    margin:       0.5,
    filename:     'billing-123456.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().set(opt).from(element).save()
}
const canTeleport = ref(false)
const items = ref([
  {
    title: "Mentions",
    qty: "1",
    rate: "9.00",
    amount: "9.00",
  },
  {
    title: "Soft UI Design System PRO",
    qty: "3",
    rate: "100.00",
    amount: "300.00",
  },
  {
    title: "Parts for service",
    qty: "1",
    rate: "89.00",
    amount: "89.00",
  },
])
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
h1 {
  font-size: 36px;
  margin-bottom: 12px;
}
p {
  font-size: 16px;
  color: #555;
  margin-bottom: 24px;
}
.btn-primary {
  background: #1abc9c;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
