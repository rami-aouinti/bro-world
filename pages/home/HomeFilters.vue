<script setup lang="ts">

</script>

<template>
  <v-card
    rounded="xl" class="mx-3" variant="text"
  >
    <v-card-title class="d-flex justify-center mt-auto text-h5">
      <span class="text-h6">Rating overview</span>
    </v-card-title>

    <div class="d-flex align-center flex-column my-auto">
      <div class="text-h2 mt-5">
        3.5
        <span class="text-h6 ml-n3">/5</span>
      </div>

      <v-rating
        :model-value="3.5"
        color="primary"
        half-increments
      ></v-rating>
      <div class="px-3">3,360 ratings</div>
    </div>

    <v-list
      bg-color="transparent"
      class="d-flex flex-column-reverse"
      density="compact"
    >
      <v-list-item v-for="(rating,i) in 5" :key="i">
        <v-progress-linear
          :model-value="rating * 15"
          class="mx-n5"
          color="primary"
          height="20"
          rounded
        ></v-progress-linear>

        <template v-slot:prepend>
          <span>{{ rating }}</span>
          <v-icon class="mx-3" icon="mdi-star"></v-icon>
        </template>

        <template v-slot:append>
          <div class="rating-values">
            <span class="d-flex justify-end"> {{ rating * 224 }} </span>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<style scoped>
.min-h-section {
  min-height: 280px;
}
</style>
