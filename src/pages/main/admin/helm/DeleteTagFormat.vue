<template>
  <PlatzModal
    ref="modal"
    title="Delete Tag Format"
    btn-class="btn-danger"
    :error="state.error"
    :working="state.disabled"
    size="lg"
    @submit="submit"
  >
    <div class="my-3 alert alert-danger">
      <div class="my-2 fw-bold">
        <FaIcon icon="triangle-exclamation" fixed-width />
        Careful
      </div>
      <div class="my-2">You are about to delete the following tag format:</div>
    </div>

    <div v-if="state.item" class="my-3 font-monospace rounded border p-3">
      {{ state.item.pattern }}
    </div>

    <div class="my-3">Are you sure you want to continue?</div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { type HelmTagFormat } from "@platzio/sdk";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { useStore } from "@/store";

function initialData(): {
  error: any;
  disabled: boolean;
  item?: HelmTagFormat;
} {
  return {
    error: undefined,
    disabled: false,
    item: undefined,
  };
}

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

function open(item: HelmTagFormat) {
  Object.assign(state, initialData());
  state.item = item;
  modal.value!.open();
}

function close() {
  modal.value!.close();
}

async function submit() {
  if (!state.item || !state.item.id) {
    return;
  }
  try {
    state.disabled = true;
    state.error = null;
    await store!.collections.helmTagFormats.deleteItem(state.item.id);
    modal.value!.close();
  } catch (error) {
    state.error = error;
    state.disabled = false;
  }
}

defineExpose({ open, close });
</script>
