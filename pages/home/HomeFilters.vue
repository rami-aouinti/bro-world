<script setup lang="ts">
const avatar1 = '/img/team-1.jpg'
const logoSlack = '/img/small-logos/logo-slack.svg'
const logoInvision = '/img/small-logos/logo-invision.svg'

const brands = [
]

const cards = [
]
</script>

<template>
  <v-card v-for="card in cards" :key="card.title" class="mb-6 min-h-section" variant="text">
    <div class="px-4 py-4">
      <v-row class="align-center">
        <v-col cols="9">
          <h5 class="text-left text-h5 font-weight-bold mb-1 text-primary">{{ card.title }}</h5>
        </v-col>
        <v-col cols="3" class="text-end">
          <v-menu transition="slide-y-transition" offset-y offset-x min-width="150">
            <template #activator="{ props }">
              <v-btn
                variant="text"
                icon
                :ripple="false"
                v-bind="props"
                small
                aria-label="Open card menu"
              >
                <v-icon size="16">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list class="pa-2" aria-label="Team actions">
              <v-list-item class="list-item-hover-active border-radius-md">
                <v-list-item-title>Edit Team</v-list-item-title>
              </v-list-item>
              <v-list-item class="list-item-hover-active border-radius-md">
                <v-list-item-title>Add Member</v-list-item-title>
              </v-list-item>
              <v-list-item class="list-item-hover-active border-radius-md">
                <v-list-item-title>See Details</v-list-item-title>
              </v-list-item>
              <hr class="horizontal dark my-2" />
              <v-list-item class="list-item-hover-active border-radius-md">
                <v-list-item-title class="text-danger">Remove Team</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
      <p class="text-left text-body font-weight-light mt-3">{{ card.description }}</p>
      <hr class="horizontal dark my-4" />
      <div class="d-flex">
        <p class="mb-0 font-weight-light text-body">Industry:</p>
        <v-btn
          variant="text"
          small
          :ripple="false"
          class="border-radius-md font-weight-bolder px-3 py-3 badge-font-size ms-auto text-body"
          color="#e4e8ed"
          aria-label="Industry badge"
        >
          {{ card.industry }}
        </v-btn>
      </div>
      <hr class="horizontal dark my-4" />
      <div class="d-flex">
        <p class="mb-0 font-weight-light text-body">Rating:</p>
        <div class="rating ms-auto" role="img" aria-label="Team rating">
          <v-icon size="16">mdi-star</v-icon>
          <v-icon size="16">mdi-star</v-icon>
          <v-icon size="16">mdi-star</v-icon>
          <v-icon size="16">mdi-star</v-icon>
          <v-icon v-if="card.rating === 'partial'" size="16">mdi-star-half</v-icon>
          <v-icon v-if="card.rating === 'full'" size="16">mdi-star</v-icon>
        </div>
      </div>
      <hr class="horizontal dark my-4" />
      <div class="d-flex">
        <p class="mb-0 font-weight-light text-body">Members:</p>
        <span class="avatar-group d-flex ms-auto">
          <v-tooltip v-for="(avatar, i) in card.avatars" :key="i" bottom>
            <template #activator="{ props }">
              <v-avatar
                v-bind="props"
                width="24"
                height="24"
                class="border border-white ms-n3"
                :aria-labelledby="`tooltip-${card.title}-${i}`"
              >
                <NuxtImg :src="avatar" :alt="`Avatar of member ${i + 1}`" width="24" height="24" />
              </v-avatar>
            </template>
            <span :id="`tooltip-${card.title}-${i}`">Member {{ i + 1 }}</span>
          </v-tooltip>
        </span>
      </div>
    </div>
  </v-card>

  <v-card v-for="(card, i) in brands" :key="i" class="mb-6 min-h-section" variant="text">
    <div class="px-4 py-4">
      <div class="d-flex">
        <v-avatar height="40" width="40">
          <NuxtImg :alt="card.title" :src="card.img" width="40" height="40" />
        </v-avatar>
        <v-row class="align-center">
          <v-col cols="9">
            <h6 class="text-left mb-0 text-h6 text-typo font-weight-bold">{{ card.title }}</h6>
          </v-col>
          <v-col cols="3" class="text-end">
            <p class="text-right text-xs mb-0 text-body">{{ card.hour }}</p>
          </v-col>
        </v-row>
      </div>
      <p class="text-left text-body font-weight-light mt-3">{{ card.description }}</p>
      <div class="d-flex">
        <p class="mb-0 text-body">
          <b>Meeting ID</b>: <span class="font-weight-light">{{ card.id }}</span>
        </p>
      </div>
      <hr class="horizontal dark my-4" />
      <div class="d-flex">
        <v-btn variant="text" class="font-weight-bolder mb-0" x-small aria-label="Join meeting">Join</v-btn>
        <span class="avatar-group d-flex ms-auto">
          <v-tooltip v-for="(avatar, j) in card.avatars" :key="j" bottom color="#212529">
            <template #activator="{ props }">
              <v-avatar
                v-bind="props"
                width="24"
                height="24"
                class="border border-white ms-n3"
                :aria-label="`Member ${j + 1}`"
              >
                <NuxtImg :src="avatar" :alt="`Avatar of member ${j + 1}`" width="24" height="24" />
              </v-avatar>
            </template>
            <span>Member {{ j + 1 }}</span>
          </v-tooltip>
        </span>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.min-h-section {
  min-height: 280px;
}
</style>
