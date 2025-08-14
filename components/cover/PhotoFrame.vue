<template>
  <div
    class="pf"
    :class="[
      `pf--${variant}`,
      shape === 'circle' ? 'pf--circle' : 'pf--square'
    ]"
    :style="wrapperStyle"
  >
    <div v-if="variant==='guidelines' && !hasImage" class="pf-guides">
      <div class="pf-cross" />
      <div class="pf-dash" />
      <div class="pf-label">Photo</div>
    </div>

    <img v-if="hasImage" :src="src" class="pf-img" :style="imgStyle" alt="photo" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'plain'|'frame'|'guidelines'|'elevated'|'elevated-frame'
type Shape = 'square'|'circle'

const props = defineProps<{
  src: string
  widthMm: number
  heightMm: number
  shape: Shape
  variant: Variant
  accent?: string

  /* bordure pilotable */
  borderStyle?: 'none'|'solid'|'dashed'|'dotted'
  borderWidthPx?: number
  borderColor?: string
}>()

const hasImage = computed(() => !!props.src && props.src.length > 20)

const wrapperStyle = computed(() => {
  const base:any = {
    width: `${props.widthMm}mm`,
    height: `${props.heightMm}mm`,
    '--pf-accent': props.accent || '#cf4f4f',
    '--pf-border-style': props.borderStyle || 'none',
    '--pf-border-width': `${props.borderWidthPx ?? 0}px`,
    '--pf-border-color': props.borderColor || '#000000',
  }
  if (props.shape === 'circle') base.borderRadius = '9999px'
  return base
})

const imgStyle = computed(() => ({
  borderStyle: props.borderStyle || 'none',
  borderWidth: `${props.borderWidthPx ?? 0}px`,
  borderColor: props.borderColor || '#000000',
  borderRadius: props.shape === 'circle' ? '9999px' : '6px',
  objectFit: 'cover',
  width: '100%',
  height: '100%',
  display: 'block',
}))
</script>

<style scoped>
.pf{
  position: relative;
  background: transparent;
  overflow: hidden;
  box-sizing: border-box;
}

/* Variants */
.pf--plain{
  box-shadow: none;
}
.pf--frame{
  box-shadow: none;
  border: var(--pf-border-width, 0px) var(--pf-border-style, none) var(--pf-border-color, transparent);
  border-radius: 6px;
}
.pf--elevated{
  box-shadow: 0 10px 22px rgba(0,0,0,.15);
  border-radius: 6px;
}
.pf--elevated-frame{
  box-shadow: 0 10px 22px rgba(0,0,0,.15);
  border: var(--pf-border-width, 0px) var(--pf-border-style, none) var(--pf-border-color, transparent);
  border-radius: 6px;
}
.pf--guidelines{
  background: #f6f6f6;
  border: 2px dashed #c0c0c0;
  border-radius: 6px;
}

/* Placeholder guides */
.pf-guides{
  position:absolute; inset:0;
}
.pf-cross::before,
.pf-cross::after{
  content:'';
  position:absolute;
  inset:auto;
  background:#bdbdbd;
}
.pf-cross::before{
  width:2px; height:100%; left:50%; top:0; transform:translateX(-50%);
}
.pf-cross::after{
  height:2px; width:100%; top:50%; left:0; transform:translateY(-50%);
}
.pf-dash{
  position:absolute; inset:10px;
  border:1px dashed #bdbdbd;
  border-radius: 4px;
}
.pf-label{
  position:absolute; left:50%; top:50%;
  transform: translate(-50%,-50%);
  color:#888; font-size:12px; background:#fff; padding:2px 6px; border-radius:4px; opacity:.85;
}

/* Image */
.pf-img{
  background: transparent;
  box-sizing: border-box;
}
</style>
