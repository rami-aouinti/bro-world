<template>
  <div class="p-4 bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center overflow-hidden">
    <span
      class="flex tabular-nums text-slate-900 dark:text-white text-5xl font-extrabold mb-2 [counter-set:_num_var(--num)] before:content-[counter(num)] animate-counter">
      <span class="sr-only">{{ targetNumber }}  </span>
      <span class="flex text-white-900 px-2" style="font-size: 21px; align-self: flex-end"> {{ text }}</span>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
const props = defineProps({
  targetNumber: {
    type: Number,
    required: true,
    default: 1234,
  },
  text : {
    type : String,
    default : "Occuped hours"
  }
});


onMounted(() => {
  startCounter()
})

const startCounter = () => {
  const counter = document.querySelector(".animate-counter");
  counter.animate([{ "--num": 0 }, { "--num": props.targetNumber }], {
    duration: 1000,
    easing: "ease-out",
    fill: "forwards",
  });
};


</script>

<style scoped>
@property --num {
  syntax: "<integer>";
  initial-value: 0;
  inherits: false;
}

@keyframes counter {
  from {
    --num: 0;
  }

  to {
    --num: v-bind(props.targetNumber);
  }
}
</style>
