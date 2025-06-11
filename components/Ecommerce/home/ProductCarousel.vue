<script setup lang="ts">
import TileCard from "~/components/Ecommerce/product/TileCard.vue";
import type { ShopifyProducts } from "~/modules/shopify/types";

defineProps<{ products?: ShopifyProducts, title: string, description: string, link: string }>();
</script>

<template>
  <div v-if="products?.edges && products?.edges.length" class="carousel-wrapper">
    <div class="carousel-header">
      <div class="header-left">
        <h2 class="carousel-title">{{ title }}</h2>
        <p class="carousel-description">{{ description }}</p>
      </div>

      <NuxtLink :to="link" class="see-all-link">
        See all
        <v-icon class="see-all-icon" size="20">mdi-arrow-right-bold</v-icon>
      </NuxtLink>
    </div>

    <div class="carousel-scroll">
      <TileCard
        v-for="{ node } in products.edges"
        :key="node.id"
        :product="node"
      />
    </div>
  </div>
</template>

<style scoped>
.carousel-wrapper {
  margin: 64px 0;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.header-left {
  text-align: left;
  flex: 1;
}

.carousel-title {
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 8px;
}

.see-all-link {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.see-all-icon {
  margin-left: 8px;
}

.carousel-scroll {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding-bottom: 8px;
  scroll-behavior: smooth;
}

.carousel-scroll::-webkit-scrollbar {
  display: none;
}
</style>
