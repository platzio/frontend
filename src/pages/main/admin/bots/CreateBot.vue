<template>
  <PlatzModal
    ref="modal"
    title="Create Bot"
    btn-class="btn-primary"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div class="mb-2">Enter a name for the new bot:</div>
    <div class="my-3">
      <input
        type="text"
        class="form-control"
        v-model="state.display_name"
        placeholder="New bot name"
        required
      />
    </div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { useStore } from "@/store";

function initialData(): {
  error?: any;
  working: boolean;
  display_name?: string;
} {
  return {
    error: undefined,
    working: false,
    display_name: undefined,
  };
}

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

function open() {
  Object.assign(state, initialData());
  modal.value?.open();
}

function close() {
  modal.value?.close();
}

async function submit() {
  if (!state.display_name) {
    return;
  }
  try {
    state.working = true;
    state.error = undefined;
    await store?.collections.bots.createItem({
      display_name: state.display_name,
    });
    modal.value?.close();
  } catch (error) {
    state.error = error;
    state.working = false;
  }
}

defineExpose({ open, close });
</script>
