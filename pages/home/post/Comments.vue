<script setup lang="ts">
import NewComment from "~/pages/home/post/NewComment.vue";
import ReactComment from "~/pages/home/post/ReactComment.vue";
</script>

<template>
  <div class="mb-1">
    <hr class="horizontal dark mt-1 mb-5" />
    <div class="d-flex">
      <div class="flex-shrink-0">
        <v-avatar>
          <v-img src="@/assets/img/bruce-mars.jpg"/>
        </v-avatar>
      </div>
      <div class="flex-grow-1 ms-4">
        <h5
          class="text-left text-h5 text-typo font-weight-bold mt-0 mb-2"
        >
          Michael Lewis
        </h5>
        <p class="text-left text-sm font-weight-light text-body">
          I always felt like I could do anything. That’s the main
          thing people are controlled by! Thoughts- their
          perception of themselves!
        </p>
        <ReactComment></ReactComment>
      </div>
    </div>

    <div class="d-flex mt-5">
      <div class="flex-shrink-0">
        <v-avatar>
          <v-img src="@/assets/img/team-5.jpg"/>
        </v-avatar>
      </div>
      <div class="flex-grow-1 ms-4">
        <h5
          class="text-left text-h5 text-typo font-weight-bold mt-0 mb-2"
        >
          Jessica Stones
        </h5>
        <p class="text-left text-sm font-weight-light text-body">
          Society has put up so many boundaries, so many
          limitations on what’s right and wrong that it’s almost
          impossible to get a pure thought out. It’s like a little
          kid, a little boy.
        </p>
        <ReactComment></ReactComment>
      </div>
    </div>

    <NewComment></NewComment>
  </div>
</template>
