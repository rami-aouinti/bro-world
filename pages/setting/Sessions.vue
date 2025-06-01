<template>
  <v-card
    id="sessions"
    class="py-4"
    rounded="xl"
    variant="text"
    >
    <div class="px-6 py-6">
      <h5 class="text-h5 font-weight-bold text-typo">Sessions</h5>
      <p class="text-sm text-body font-weight-light">
        This is a list of devices that have logged into your account. Remove
        those that you do not recognize.
      </p>
    </div>
    <div class="px-6 pb-6 pt-0 overflow-scroll">
      <div v-for="(item, i) in sessions" :key="item.title">
        <div class="d-flex align-center ms-0">
          <div class="text-center w-5">
            <v-icon>{{ item.icon }} text-lg opacity-6 text-body</v-icon>
          </div>
          <div class="my-auto ms-4">
            <div class="h-100">
              <p
                class="text-sm mb-1 text-body font-weight-light"
                v-if="item.title"
              >
                {{ item.title }}
              </p>
              <p
                class="mb-0 text-xs text-body font-weight-light"
                v-if="item.description"
              >
                {{ item.description }}
              </p>
              <p class="my-auto text-body font-weight-light" v-if="item.text">
                {{ item.text }}
              </p>
            </div>
          </div>
          <v-btn
            v-if="item.badge"
            variant="text"
            small
            :ripple="false"
            height="21"
            class="border-radius-md font-weight-bolder px-2 badge-font-size ms-auto text-success text-xxs"
            color="#bce2be"
            >{{ item.badge }}</v-btn
          >
          <p
            class="text-secondary font-weight-light text-sm my-auto me-4"
            :class="item.badge ? '' : 'ms-auto'"
          >
            {{ item.city }}
          </p>
          <v-btn
            :ripple="false"
            icon
            variant="text"
            width="auto"
            class="ps-0 mb-0 text-primary text-capitalize font-weight-light icon-move-right align-center"
          >
            See more
            <v-icon right dark size="12" class="ms-0 mt-0">
              fa fa-arrow-right
            </v-icon>
          </v-btn>
        </div>
        <hr v-if="i !== sessions.length - 1" class="horizontal dark my-4" />
      </div>
    </div>
  </v-card>
</template>
<script>
export default {
  name: 'Sessions',
  data() {
    return {
      sessions: [
        {
          icon: 'fas fa-desktop',
          title: 'Bucharest 68.133.163.201',
          description: 'Your current session',
          badge: 'Active',
          city: 'EU',
        },
        {
          icon: 'fas fa-desktop',
          text: 'Chrome on macOS',
          city: 'US',
        },
        {
          icon: 'fas fa-mobile',
          text: 'Safari on iPhone',
          city: 'US',
        },
      ],
    }
  },
}
</script>
