<script setup lang="ts">

const stories = [
  {
    image: '@/assets/img/team-1.jpg',
    user: 'Abbie W',
  },
  {
    image: '@/assets/img/team-2.jpg',
    user: 'Boris U',
  },
  {
    image: '@/assets/img/team-3.jpg',
    user: 'Kay R',
  },
  {
    image: '@/assets/img/team-4.jpg',
    user: 'Tom M',
  },
  {
    image: '@/assets/img/team-5.jpg',
    user: 'Nicole N',
  },
  {
    image: '@/assets/img/team-9.jpg',
    user: 'Marie P',
  },
  {
    image: '@/assets/img/team-2.jpg',
    user: 'Bruce M',
  },
  {
    image: '@/assets/img/team-1.jpg',
    user: 'Sandra A',
  },
  {
    image: '@/assets/img/team-3.jpg',
    user: 'Katty L',
  },
  {
    image: '@/assets/img/team-4.jpg',
    user: 'Emma O',
  },
  {
    image: '@/assets/img/team-9.jpg',
    user: 'Tao G',
  },
]
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card rounded="xl" class="overflow-scroll mx-3" variant="text">
        <div class="py-4 d-flex">
          <v-col lg="1" md="2" sm="3" cols="4" class="text-center">
            <v-avatar size="58" class="shadow-sm">
              <v-icon class="material-icons-round">mdi-plus</v-icon>
            </v-avatar>
            <p class="mb-0 text-sm text-body font-weight-light mt-2">
              {{ $t('AddStory') }}
            </p>
          </v-col>
          <v-col
            v-for="avatar in stories"
            :key="avatar.user"
            lg="1"
            md="2"
            sm="3"
            cols="4"
            class="text-center"
          >
            <v-avatar size="58" class="border border-primary px-1 py-1">
              <v-img :src="avatar.image" width="50" height="50"/>
            </v-avatar>
            <p class="mb-0 text-sm text-body font-weight-light mt-2">
              {{ avatar.user }}
            </p>
          </v-col>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
