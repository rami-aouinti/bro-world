<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="pa-1">
          <h6 class="text-h6 text-typo font-weight-bold mb-2">
            Track order
          </h6>
          <v-timeline density="compact" side="end">
            <v-timeline-item
              v-for="(item, i) in timeline"
              :key="item.title + i"
              dot-color="primary"
              size="small"
              fill-dot
              class="timeline"
            >
              <template v-slot:icon>
                <v-avatar size="26" color="transparent">
                  <v-icon
                    size="18"
                  >mdi-orbit</v-icon
                  >
                </v-avatar>
              </template>

              <v-card width="220" rounded="xl" class="bg-gradient-primary shadow-primary mx-3 my-1" variant="text" elevation="10">
                <v-card-title>
                  <h6 class="text-sm font-weight-bold mb-0 d-block" :class="isDark ? 'text-white' : 'text-default'">
                    {{ item.title }}
                  </h6>
                  <p class="text-secondary font-weight-light text-xs mb-0">
                    {{ item.date }}
                  </p>
                </v-card-title>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </div>
      </teleport>
    </client-only>
    <v-card rounded="xl" class="bg-gradient-primary shadow-primary mx-3" variant="text" elevation="10">
      <div class="px-4 pt-4">
        <div class="d-flex align-center">
          <div>
            <h6 class="text-h6 text-typo font-weight-bold mb-2">
              Order Details
            </h6>
            <p class="text-sm text-body font-weight-light mb-0">
              Order no. <span class="font-weight-bold">241342</span> from
              <span class="font-weight-bold">23.02.2021</span>
            </p>
            <p class="text-sm font-weight-light text-body">
              Code: <span class="font-weight-bold">KF332</span>
            </p>
          </div>
          <v-btn
            elevation="0"
            :ripple="false"
            height="43"
            class="
                    font-weight-bold
                    text-uppercase
                    btn-default
                    bg-gradient-default
                    py-2
                    px-6
                    me-2
                    ms-auto
                  "
            color="#5e72e4"
            small
          >Invoice</v-btn
          >
        </div>
      </div>
      <div class="px-4 pb-4">
        <hr class="horizontal dark mt-0 mb-6" />
        <v-row>
          <v-col md="6">
            <div class="d-flex">
              <v-avatar
                class="me-4 border-rounded"
                alt="product-image"
                width="110px"
                height="110px"
              >
                <v-img
                  src="/img/products/product-12.jpg"
                >
                </v-img>
              </v-avatar>
              <div>
                <h6
                  class="
                          text-h6 text-typo text-lg
                          font-weight-bold
                          mb-0
                          mt-2
                          mb-1
                        "
                >
                  Dandelion Print Shirt
                </h6>
                <p class="text-sm text-body font-weight-light mb-3">
                  Order was delivered 2 days ago.
                </p>
                <v-btn
                  variant="outlined"
                  :ripple="false"
                  color="#cdf59b"
                >Delivered</v-btn
                >
              </div>
            </div>
          </v-col>
          <v-col md="6" class="text-end my-auto">
            <v-btn
              variant="outlined"
              :ripple="false"
              color="#5e72e4"
            >Contact us</v-btn
            >
            <p class="text-sm text-body font-weight-light mt-2 mb-0">
              Do you like the product? Leave us a review
              <a
                href="javascript:"
                class="text-dark text-decoration-none"
              >here</a
              >.
            </p>
          </v-col>
        </v-row>
        <hr class="horizontal dark my-6" />
        <v-row>
          <v-col cols="12" md="5">
            <h6 class="text-h6 text-typo font-weight-bold mb-3">
              Payment details
            </h6>
            <div class="pa-5 border border-radius-lg d-flex align-center">
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
                  <v-btn
                    small
                    rounded
                    v-bind="attrs"
                    v-on="on"
                    min-width="25"
                    elevation="0"
                    :ripple="false"
                    height="25"
                    width="25"
                    class="
                            font-weight-600
                            text-capitalize
                            btn-outline-secondary
                            py-3
                            px-3
                            ms-auto
                          "
                    color="transparent"
                  >
                    <v-icon size="8">fas fa-info</v-icon>
                  </v-btn>
                </template>
                <span>We do not store card details</span>
              </v-tooltip>
            </div>

          </v-col>
          <v-col cols="12" md="4">
            <h6 class="text-h6 text-typo font-weight-bold mb-3">
              Billing Information
            </h6>
            <div
              class="d-flex flex-column bg-transparent pa-6 border-radius-lg"
            >
              <h6 class="text-typo font-weight-bold mb-4 text-sm">
                Oliver Liam
              </h6>
              <span class="mb-2 text-body text-xs"
              >Company Name:
                      <span class="text-dark font-weight-bold ms-2"
                      >Viking Burrito</span
                      ></span
              >
              <span class="mb-2 text-body text-xs"
              >Email Address:
                      <span class="text-dark ms-2 font-weight-bold"
                      >oliver@burrito.com</span
                      ></span
              >
              <span class="text-xs text-body"
              >VAT Number:
                      <span class="text-dark ms-2 font-weight-bold"
                      >FRB1235476</span
                      ></span
              >
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <h6 class="text-h6 text-typo font-weight-bold mb-3">
              Order Summary
            </h6>
            <div class="d-flex">
              <span class="mb-2 text-body text-sm"> Product Price: </span>
              <span class="text-dark font-weight-bold ms-auto">$90</span>
            </div>
            <div class="d-flex">
              <span class="mb-2 text-body text-sm"> Delivery: </span>
              <span class="text-dark font-weight-bold ms-auto">$14</span>
            </div>
            <div class="d-flex">
              <span class="mb-2 text-body text-sm"> Taxes: </span>
              <span class="text-dark font-weight-bold ms-auto"
              >$1.95</span
              >
            </div>
            <div class="d-flex mt-6">
              <span class="mb-2 text-body text-lg"> Total: </span>
              <span
                class="text-dark text-lg ms-2 font-weight-bold ms-auto"
              >$105.95</span
              >
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>

import { ref, computed, onMounted, nextTick } from 'vue'

const timeline = ref([
  {
    title: "Order received",
    date: "22 DEC 7:20 PM",
    color: "#b0eed3",
    iconColor: "#1aae6f",
    icon: "notifications",
    btn: "secondary",
  },
  {
    title: "Generate order id #1832412",
    date: "22 DEC 7:21 AM",
    color: "#b0eed3",
    iconColor: "#1aae6f",
    icon: "code",
    btn: "secondary",
  },
  {
    title: "Order transmited to courier",
    date: "22 DEC 8:10 AM",
    color: "#b0eed3",
    iconColor: "#1aae6f",
    icon: "shopping_cart",
    btn: "secondary",
  },
  {
    title: "Order delivered",
    date: "22 DEC 4:54 PM",
    color: "#b0eed3",
    iconColor: "#1aae6f",
    icon: "done",
    btn: "success",
  },
])
const canTeleport = ref(false)
const orderNumber = '000000003'
const order = {
  status: 'new',
  date: 'Jul 16, 2025',
  currency: 'USD',
  total: 65.62,
  billing: { name: 'asd asdada', city: 'köln', zip: '50859', country: 'GERMANY' },
  shipping: { name: 'asd asdada', city: 'köln', zip: '50859', country: 'GERMANY' },
  paymentMethod: 'Cash on delivery',
  paymentStatus: 'Awaiting payment',
  shippingMethod: 'FedEx',
  items: [
    {
      id: 1,
      name: 'Starlight Echo T-Shirt',
      description: 'T-shirt size: S',
      image: 'https://via.placeholder.com/60',
      price: 61.89,
      qty: 1,
    },
  ],
  totals: {
    items: 61.89,
    taxes: 0.0,
    discount: 0.0,
    shipping: 3.73,
  },
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
})
</script>

<style scoped>
.order-details {
  max-width: 960px;
  margin: 40px auto;
  padding: 16px;
  font-family: sans-serif;
}
h1 {
  margin-bottom: 12px;
}
.grid {
  display: flex;
  gap: 20px;
  margin: 20px 0;
  flex-wrap: wrap;
}
.box {
  flex: 1;
  border: 1px solid #eee;
  padding: 16px;
  border-radius: 6px;
}
address {
  font-style: normal;
  line-height: 1.4;
}
.badge {
  background: #ccc;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}
.badge.blue {
  background: #0d6efd;
  color: white;
}
.tag {
  background: #27ae60;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
}
.btn-pay {
  background: #1abc9c;
  color: white;
  border: none;
  padding: 8px 16px;
  float: right;
  margin-top: -40px;
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 4px;
}
.order-table {
  width: 100%;
  border-collapse: collapse;
  margin: 30px 0;
}
.order-table th,
.order-table td {
  border-bottom: 1px solid #eee;
  padding: 12px;
  vertical-align: middle;
}
.order-table img.thumb {
  width: 60px;
  height: auto;
  margin-right: 12px;
  float: left;
}
.summary {
  text-align: right;
  font-size: 15px;
}
.summary h3 {
  margin-top: 12px;
  font-size: 20px;
}
</style>
