<!-- components/cover/CoverCorner.vue -->
<template>
  <div class="corner-layer">
    <!-- QUARTER (quart de disque) -->
    <svg
      v-if="type === 'quarter'"
      :class="anchorClass"
      :width="squarePx"
      :height="squarePx"
      viewBox="0 0 100 100"
    >
      <path :fill="color1" :d="quarterPath" />
    </svg>

    <!-- DIAGONAL (triangle) -->
    <svg
      v-else-if="type === 'diagonal'"
      :class="anchorClass"
      :width="squarePx"
      :height="squarePx"
      viewBox="0 0 100 100"
    >
      <path :fill="color1" :d="diagonalPath" />
    </svg>

    <!-- NOTCH (chanfrein) -->
    <svg
      v-else-if="type === 'notch'"
      :class="anchorClass"
      :width="notchW"
      :height="notchH"
      viewBox="0 0 135 95"
    >
      <path :fill="color1" :d="notchPath" />
    </svg>

    <!-- RIBBON (ruban 2 couleurs) -->
    <svg
      v-else-if="type === 'ribbon'"
      :class="anchorClass"
      :width="ribbonWpx"
      :height="ribbonHpx"
      viewBox="0 0 160 110"
    >
      <rect :fill="color2" x="0" y="0" :width="160" :height="110" />
      <rect :fill="color1" :x="ribbonStripeX" :y="ribbonStripeY" :width="stripeW" :height="stripeH" />
    </svg>

    <!-- DUAL-SLOPE (double pente) -->
    <svg
      v-else-if="type === 'dual-slope'"
      :class="anchorClass"
      :width="squarePx"
      :height="squarePx"
      viewBox="0 0 130 130"
    >
      <path :fill="color2" :d="dualBackPath" />
      <path :fill="color1" :d="dualFrontPath" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type CornerType   = 'quarter'|'diagonal'|'notch'|'ribbon'|'dual-slope'
type CornerAnchor = 'top-left'|'top-right'|'bottom-left'|'bottom-right'

const props = defineProps<{
  type: CornerType
  anchor: CornerAnchor
  sizeMm: number
  primary?: string
  secondary?: string
}>()

/* ---------- couleurs ---------- */
const color1 = computed(() => props.primary   || '#b88b6a')
const color2 = computed(() => props.secondary || '#091b2d')

/* ---------- position (miroirs) ---------- */
const anchorClass = computed(() => `corner corner--${props.anchor}`)

/* ---------- mm → px ---------- */
const pxPerMm = 3.78
const basePx  = computed(() => Math.max(0, (props.sizeMm || 0) * pxPerMm))

/* tailles carrées (quarter, diagonal, dual-slope) */
const squarePx = computed(() => Math.round(basePx.value))

/* tailles à ratio pour notch (135×95) et ribbon (160×110) */
const notchW = computed(() => Math.round(basePx.value))
const notchH = computed(() => Math.round(basePx.value * (95/135)))

const ribbonWpx = computed(() => Math.round(basePx.value))
const ribbonHpx = computed(() => Math.round(basePx.value * (110/160)))

/* ---------- PATHS identiques à CornerDecoration.vue ---------- */

/** QUARTER : quart de disque selon l’ancrage (viewBox 100×100) */
const quarterPath = computed(() => {
  switch (props.anchor) {
    case 'top-left':     return 'M0,0 L100,0 A100,100 0 0 1 0,100 Z'
    case 'top-right':    return 'M100,0 L100,100 A100,100 0 0 1 0,0 Z'
    case 'bottom-left':  return 'M0,100 L100,100 A100,100 0 0 0 0,0 Z'
    case 'bottom-right': return 'M100,100 L0,100 A100,100 0 0 1 100,0 Z'
  }
})

/** DIAGONAL : grand triangle plein (viewBox 100×100) */
const diagonalPath = computed(() => {
  switch (props.anchor) {
    case 'top-left':     return 'M0,0 L100,0 L0,100 Z'
    case 'top-right':    return 'M100,0 L100,100 L0,0 Z'
    case 'bottom-left':  return 'M0,100 L100,100 L0,0 Z'
    case 'bottom-right': return 'M100,100 L0,100 L100,0 Z'
  }
})

/** NOTCH : chanfrein (viewBox 135×95) */
const notchPath = computed(() => {
  switch (props.anchor) {
    case 'top-left':     return 'M0,0 L135,0 L100,95 L0,95 Z'
    case 'top-right':    return 'M0,0 L135,0 L135,95 L35,95 Z'
    case 'bottom-left':  return 'M0,95 L135,95 L100,0 L0,0 Z'
    case 'bottom-right': return 'M0,95 L135,95 L135,0 L35,0 Z'
  }
})

/** RIBBON : ruban (viewBox 160×110, bandes prédéfinies) */
const stripeW = 80
const stripeH = 12
const ribbonStripeX = computed(() =>
  (props.anchor.includes('right') ? 160 - stripeW - 25 : 160 - stripeW + 25)
)
const ribbonStripeY = computed(() =>
  (props.anchor.includes('top') ? 60 : 110 - 35)
)

/** DUAL-SLOPE : double pente (viewBox 130×130) */
const dualBackPath = computed(() => {
  switch (props.anchor) {
    case 'top-left':     return 'M0,0 L130,0 L85,130 L0,130 Z'
    case 'top-right':    return 'M0,0 L130,0 L130,130 L45,130 Z'
    case 'bottom-left':  return 'M0,130 L130,130 L85,0 L0,0 Z'
    case 'bottom-right': return 'M130,130 L0,130 L0,0 L85,0 Z'
  }
})
const dualFrontPath = computed(() => {
  switch (props.anchor) {
    case 'top-left':     return 'M10,10 L120,10 L80,120 L10,120 Z'
    case 'top-right':    return 'M10,10 L120,10 L120,120 L40,120 Z'
    case 'bottom-left':  return 'M10,120 L120,120 L80,10 L10,10 Z'
    case 'bottom-right': return 'M120,120 L10,120 L10,10 L80,10 Z'
  }
})
</script>

<style scoped>
.corner-layer{
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1; /* sous le contenu; ton contenu est z-index 2+ */
}
.corner{
  position: absolute;
}
.corner--top-left    { top: 0; left: 0; }
.corner--top-right   { top: 0; right: 0; }
.corner--bottom-left { bottom: 0; left: 0; }
.corner--bottom-right{ bottom: 0; right: 0; }
</style>
