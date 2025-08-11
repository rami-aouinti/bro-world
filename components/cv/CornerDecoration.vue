<!-- components/cv/CornerDecoration.vue -->
<template>
  <div class="corner-layer">
    <svg
      v-if="type === 'quarter'"
      :class="anchorClass"
      :width="sizePx"
      :height="sizePx"
      viewBox="0 0 100 100"
    >
      <path
        :fill="color1"
        :d="quarterPath"
      />
    </svg>

    <svg
      v-else-if="type === 'diagonal'"
      :class="anchorClass"
      :width="sizePx"
      :height="sizePx"
      viewBox="0 0 100 100"
    >
      <path :fill="color1" :d="diagonalPath"/>
    </svg>

    <svg
      v-else-if="type === 'notch'"
      :class="anchorClass"
      :width="sizePxX"
      :height="sizePxY"
      :viewBox="notchViewBox"
    >
      <path :fill="color1" :d="notchPath"/>
    </svg>

    <svg
      v-else-if="type === 'ribbon'"
      :class="anchorClass"
      :width="sizePxX"
      :height="sizePxY"
      :viewBox="ribbonViewBox"
    >
      <rect :fill="color2" x="0" y="0" :width="ribbonW" :height="ribbonH"/>
      <rect :fill="color1" :x="ribbonStripeX" :y="ribbonStripeY" :width="stripeW" :height="stripeH"/>
    </svg>

    <svg
      v-else-if="type === 'dual-slope'"
      :class="anchorClass"
      :width="sizePxX"
      :height="sizePxY"
      :viewBox="dualViewBox"
    >
      <path :fill="color2" :d="dualBackPath"/>
      <path :fill="color1" :d="dualFrontPath"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type CornerType = 'quarter' | 'diagonal' | 'notch' | 'ribbon' | 'dual-slope'
type CornerAnchor = 'top-left'|'top-right'|'bottom-left'|'bottom-right'

const props = defineProps<{
  corner: {
    type: CornerType
    anchor?: CornerAnchor
    color?: string
    color2?: string
    sizeMm?: number,
    offsetMmX?: number,
    offsetMmY?: number,
    rotateDeg?: number,
  },
  defaultAccent?: string
  defaultPrimary?: string
}>()

const type = computed(() => props.corner.type)
const anchor = computed<CornerAnchor>(() => props.corner.anchor ?? 'top-left')
const sizeMm = computed(() => props.corner.sizeMm ?? 30)

const color1 = computed(() => props.corner.color ?? props.defaultAccent ?? '#b88b6a')
const color2 = computed(() => props.corner.color2 ?? props.defaultPrimary ?? '#091b2d')

// px pour html2canvas (densité neutre)
const pxPerMm = 3.78
const sizePx = computed(() => Math.round(sizeMm.value * pxPerMm))
const sizePxX = sizePx
const sizePxY = computed(() => Math.round(sizeMm.value * 0.9 * pxPerMm))

const anchorClass = computed(() => `corner corner--${anchor.value}`)

/** QUARTER : un quart de disque selon l'ancrage */
const quarterPath = computed(() => {
  // rayon 100 = 100x100 viewBox
  switch (anchor.value) {
    case 'top-left':      return 'M0,0 L100,0 A100,100 0 0 1 0,100 Z'            // quart bas-gauche
    case 'top-right':     return 'M100,0 L100,100 A100,100 0 0 1 0,0 Z'          // quart bas-gauche miroir
    case 'bottom-left':   return 'M0,100 L100,100 A100,100 0 0 0 0,0 Z'
    case 'bottom-right':  return 'M100,100 L0,100 A100,100 0 0 1 100,0 Z'
  }
})

/** DIAGONAL : grand triangle plein selon l'ancrage */
const diagonalPath = computed(() => {
  switch (anchor.value) {
    case 'top-left':      return 'M0,0 L100,0 L0,100 Z'
    case 'top-right':     return 'M100,0 L100,100 L0,0 Z'
    case 'bottom-left':   return 'M0,100 L100,100 L0,0 Z'
    case 'bottom-right':  return 'M100,100 L0,100 L100,0 Z'
  }
})

/** NOTCH : chanfrein */
const notchViewBox = '0 0 135 95'
const notchPath = computed(() => {
  switch (anchor.value) {
    case 'top-left':      return 'M0,0 L135,0 L100,95 L0,95 Z'
    case 'top-right':     return 'M0,0 L135,0 L135,95 L35,95 Z'
    case 'bottom-left':   return 'M0,95 L135,95 L100,0 L0,0 Z'
    case 'bottom-right':  return 'M0,95 L135,95 L135,0 L35,0 Z'
  }
})

/** RIBBON */
const ribbonViewBox = '0 0 160 110'
const ribbonW = 160
const ribbonH = 110
const stripeW = 80
const stripeH = 12
const ribbonStripeX = computed(() => (anchor.value.includes('right') ? ribbonW - stripeW - 25 : ribbonW - stripeW + 25))
const ribbonStripeY = computed(() => (anchor.value.includes('top') ? 60 : ribbonH - 35))

/** DUAL-SLOPE */
const dualViewBox = '0 0 130 130'
const dualBackPath = computed(() => {
  switch (anchor.value) {
    case 'top-left':      return 'M0,0 L130,0 L85,130 L0,130 Z'
    case 'top-right':     return 'M0,0 L130,0 L130,130 L45,130 Z'
    case 'bottom-left':   return 'M0,130 L130,130 L85,0 L0,0 Z'
    case 'bottom-right':  return 'M130,130 L0,130 L0,0 L85,0 Z'
  }
})
const dualFrontPath = computed(() => {
  switch (anchor.value) {
    case 'top-left':      return 'M10,10 L120,10 L80,120 L10,120 Z'
    case 'top-right':     return 'M10,10 L120,10 L120,120 L40,120 Z'
    case 'bottom-left':   return 'M10,120 L120,120 L80,10 L10,10 Z'
    case 'bottom-right':  return 'M120,120 L10,120 L10,10 L80,10 Z'
  }
})
</script>

<style scoped>
.corner-layer{
  position:absolute;
  inset:0;
  pointer-events:none;
  z-index:1; /* derrière le contenu */
}
.corner{
  position:absolute;
}
.corner--top-left    { top:0; left:0; }
.corner--top-right   { top:0; right:0; }
.corner--bottom-left { bottom:0; left:0; }
.corner--bottom-right{ bottom:0; right:0; }
</style>
