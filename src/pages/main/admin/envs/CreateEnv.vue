<template>
  <PlatzModal
    ref="modal"
    title="Create Env"
    btn-class="btn-primary"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div class="mb-2">Please select a name for the new env.</div>
    <div class="my-3">
      <input
        v-model="state.name"
        type="text"
        class="form-control"
        placeholder="Enter a name"
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
  name?: string;
} {
  return {
    error: undefined,
    working: false,
    name: undefined,
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
  if (!state.name) {
    return;
  }
  try {
    state.working = true;
    state.error = undefined;
    await store?.collections.envs.createItem({
      name: state.name,
    });
    modal.value?.close();
  } catch (error) {
    state.error = error;
    state.working = false;
  }
}

defineExpose({ open, close });
</script>
