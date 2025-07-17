<template>
  <div class="quantity-input">
    <button @click="dec" :disabled="count <= 1">−</button>
    <input type="number" :value="count" readonly />
    <button @click="inc">+</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Number,
})

const emit = defineEmits(['update:modelValue'])

const count = ref(props.modelValue || 1)

watch(() => props.modelValue, val => count.value = val)
watch(count, val => emit('update:modelValue', val))

const inc = () => count.value++
const dec = () => {
  if (count.value > 1) count.value--
}
</script>

<style scoped>
.quantity-input {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 36px;
  align-items: center;
}
.quantity-input input {
  width: 40px;
  text-align: center;
  border: none;
  outline: none;
}
.quantity-input button {
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
}
.quantity-input button:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
