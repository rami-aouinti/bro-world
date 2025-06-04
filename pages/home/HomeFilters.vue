<script setup lang="ts">
const avatar1 = new URL('@/assets/img/team-1.jpg', import.meta.url).href
const logoSlack = new URL('@/assets/img/small-logos/logo-slack.svg', import.meta.url).href
const logoInvision = new URL('@/assets/img/small-logos/logo-invision.svg', import.meta.url).href

const brands = [
  {
    img: logoSlack,
    title: 'Slack Meet',
    hour: '11:00 AM',
    id: '902-128-281',
    description: 'You have an upcoming meet for Marketing Planning',
    avatars: [avatar1, avatar1, avatar1, avatar1],
  },
  {
    img: logoInvision,
    title: 'Invision',
    hour: '4:50 PM',
    id: '111-968-981',
    description: 'You have an upcoming video call for Soft Design at 5:00 PM.',
    avatars: [avatar1, avatar1, avatar1, avatar1],
  },
]

const cards = [
  {
    title: 'Digital Marketing',
    description:
      'A group of people who collectively are responsible for all of the work necessary to produce working, validated assets.',
    industry: 'Marketing Team',
    rating: 'partial',
    avatars: [avatar1, avatar1, avatar1, avatar1],
  },
  {
    title: 'Design',
    description:
      "Because it's about motivating the doers. Because I’m here to follow my dreams and inspire other people to follow their dreams, too.",
    industry: 'Design Team',
    rating: 'full',
    avatars: [avatar1, avatar1, avatar1, avatar1],
  },
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
            <template #activator="{ on, attrs }">
              <v-btn icon :ripple="false" v-bind="attrs" small v-on="on">
                <v-icon size="16">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list class="pa-2">
              <v-list-item class="list-item-hover-active border-radius-md">
                <v-list-item-title class="text-body-2 ls-0 text-body font-weight-600 py-2">Edit Team</v-list-item-title>
              </v-list-item>
              <v-list-item class="list-item-hover-active border-radius-md">
                <v-list-item-title class="text-body-2 ls-0 text-body font-weight-600 py-2">Add Member</v-list-item-title>
              </v-list-item>
              <v-list-item class="list-item-hover-active border-radius-md">
                <v-list-item-title class="text-body-2 ls-0 text-body font-weight-600 py-2">See Details</v-list-item-title>
              </v-list-item>
              <hr class="horizontal dark my-2" />
              <v-list-item class="list-item-hover-active border-radius-md">
                <v-list-item-title class="text-danger ls-0 font-weight-600 mb-0">Remove Team</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
      <p class="text-left text-body font-weight-light mt-3">{{ card.description }}</p>
      <hr class="horizontal dark my-4" />
      <div class="d-flex">
        <p class="mb-0 font-weight-light text-body">Industry:</p>
        <v-btn elevation="24" small :ripple="false" class="border-radius-md font-weight-bolder px-3 py-3 badge-font-size ms-auto text-body" color="#e4e8ed">
          {{ card.industry }}
        </v-btn>
      </div>
      <hr class="horizontal dark my-4" />
      <div class="d-flex">
        <p class="mb-0 font-weight-light text-body">Rating:</p>
        <div class="rating ms-auto">
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
          <v-tooltip v-for="(avatar, i) in card.avatars" :key="i" bottom color="#212529">
            <template #activator="{ on, attrs }">
              <v-avatar v-bind="attrs" size="24" class="border border-white ms-n3" v-on="on">
                <img :src="avatar" alt="Avatar" width="24" height="24" />
              </v-avatar>
            </template>
            <span>Member</span>
          </v-tooltip>
        </span>
      </div>
    </div>
  </v-card>

  <v-card v-for="(card, i) in brands" :key="i" class="mb-6 min-h-section" variant="text">
    <div class="px-4 py-4">
      <div class="d-flex">
        <v-avatar size="40">
          <v-img :src="card.img" width="40" height="40" />
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
        <v-btn variant="text" class="font-weight-bolder mb-0" x-small>Join</v-btn>
        <span class="avatar-group d-flex ms-auto">
          <v-tooltip v-for="(avatar, j) in card.avatars" :key="j" bottom color="#212529" class="py-1">
            <template #activator="{ on, attrs }">
              <v-avatar v-bind="attrs" size="24" class="border border-white ms-n3" v-on="on">
                <img :src="avatar" alt="Avatar" width="24" height="24" />
              </v-avatar>
            </template>
            <span>Member</span>
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
