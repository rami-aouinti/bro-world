<template>
  <div
    ref="el"
    class="editable"
    contenteditable
    :placeholder="placeholder"
    @beforeinput="isTyping = true"
    @compositionstart="isComposing = true"
    @compositionend="isComposing = false"
    @input="onInput"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()
const emit = defineEmits<{ (e:'update:modelValue', v:string):void }>()

const el = ref<HTMLElement|null>(null)
const isTyping = ref(false)
const isComposing = ref(false)

onMounted(() => { if (el.value) el.value.textContent = props.modelValue ?? '' })

// Si la valeur change depuis l'extérieur, on met à jour le DOM
watch(() => props.modelValue, (v) => {
  if (!el.value) return
  // n’écrase pas pendant la frappe locale, sinon le caret saute
  if (isTyping.value) return
  if (el.value.textContent !== v) el.value.textContent = v ?? ''
})

function onInput () {
  if (!el.value) return
  const sel = saveCaret(el.value)
  emit('update:modelValue', el.value.textContent || '')

  nextTick(() => {
    // fin d’édition => on restaure la position
    if (el.value) restoreCaret(el.value, sel)
    // on libère le flag au frame suivant
    requestAnimationFrame(() => { isTyping.value = false })
  })
}

/* --- caret helpers --- */
function saveCaret(root: HTMLElement) {
  const s = window.getSelection()
  if (!s || s.rangeCount === 0) return null
  const range = s.getRangeAt(0)
  const pre = range.cloneRange()
  pre.selectNodeContents(root)
  pre.setEnd(range.endContainer, range.endOffset)
  const pos = pre.toString().length
  return pos
}
function restoreCaret(root: HTMLElement, pos: number|null) {
  if (pos == null) return
  const setPos = (node: Node, remaining: number): [Node, number] | null => {
    if (remaining <= 0) return [node, 0]
    if (node.nodeType === 3) { // text
      const len = (node as Text).data.length
      if (len >= remaining) return [node, remaining]
      return null
    }
    for (const child of Array.from(node.childNodes)) {
      const text = child.textContent?.length ?? 0
      if (text >= remaining) return setPos(child, remaining)
      remaining -= text
    }
    return [node, (node.textContent?.length ?? 0)]
  }
  const r = document.createRange()
  const res = setPos(root, pos)
  if (!res) return
  const [node, offset] = res
  r.setStart(node, offset)
  r.collapse(true)
  const sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(r)
}
</script>

<style scoped>
.editable{
  outline: none;
  padding: 6px 10px;
  border-radius: 8px;
}
.editable:focus{ box-shadow: inset 0 0 0 2px rgba(0,0,0,.15); }
.editable:empty:before{ content: attr(placeholder); opacity:.5; }
</style>
