<template>
  <base-form-section title="Links" description="Add some links here">

    <v-card class="card-shadow border-radius-xl" id="experience">
      <div class="px-3 py-2">
        <h5 class="text-h6 font-weight-bold text-typo">Experience</h5>
      </div>
      <div class="px-2 pb-2 pt-1">
        <v-row class="px-10 pb-2 pt-1">
          <draggable
            :list="modelValue"
            item-key="link"
            class="list-group"
            ghost-class="ghost"
          >
            <template #item="{ element: link }">
              <div class="relative mb-6 group">
                <button class="absolute top-2 -left-8">
                  <icon
                    name="radix-icons:drag-handle-dots-2"
                    class="h-6 w-6 text-slate-500 drag-handle"
                  />
                </button>
                <button
                  @click="removeLink(link)"
                  class="hidden group-hover:flex items-center justify-center h-6 w-6 rounded-full bg-slate-300 text-slate-600 absolute -right-3 -top-3"
                >
                  <icon name="fluent:dismiss-24-regular" class="h-4 w-4" />
                </button>
                <div class="shadow sm:overflow-hidden sm:rounded-md">
                  <div class="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          for="name"
                          class="block text-sm font-medium text-gray-700"
                        >Experience</label
                        >
                        <input
                          type="text"
                          name="iconKey"
                          id="iconKey"
                          v-model="link.i"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          for="label"
                          class="block text-sm font-medium text-gray-700"
                        >Label</label
                        >
                        <input
                          type="text"
                          name="label"
                          id="label"
                          v-model="link.l"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div class="col-span-2">
                        <label
                          for="url"
                          class="block text-sm font-medium text-gray-700"
                        >URL</label
                        >
                        <input
                          type="url"
                          name="url"
                          id="url"
                          v-model="link.u"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <p
                      class="mt-2 text-xs text-center text-slate-400"
                      v-if="!link.l || !link.u"
                    >
                      Link shown in preview once label and url are added
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </draggable>
          <button
            @click="appendLink"
            class="mt-4 border-2 text-slate-500 border-slate-300 rounded-lg block w-full py-2"
          >
            <icon name="fluent:add-circle-24-regular" class="h-6 w-6" />
          </button>
        </v-row>
      </div>
    </v-card>
  </base-form-section>
</template>
<script lang="ts" setup>
import draggable from "vuedraggable";
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: Array,
});
const appendLink = () => {
  const list = Array.isArray(props.modelValue) ? props.modelValue : [];
  const newList = [...list, { i: "", l: "", u: "" }];
  emit("update:modelValue", newList);
};

const removeLink = (link) => {
  const list = Array.isArray(props.modelValue) ? props.modelValue : [];
  const newList = list.filter((l) => l !== link);
  emit("update:modelValue", newList);
};
</script>
<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
