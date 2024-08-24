<template>
  <PlatzModal
    ref="modal"
    title="Set Icon"
    btn-class="btn-primary"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div class="mb-2">Enter a FontAwesome icon name for the helm registry:</div>
    <div class="my-3">
      <input
        type="text"
        class="form-control"
        v-model="state.new_fa_icon"
        required
        placeholder="Enter a FontAwesome icon name"
      />
    </div>
    <div class="my-5 h1 text-center">
      <span class="px-3 py-2 rounded border border-3">
        <FaIcon :icon="state.new_fa_icon" fixed-width />
      </span>
    </div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { useStore } from "@/store";

function initialData(): {
  error: any;
  working: boolean;
  registry_id?: string;
  new_fa_icon?: string;
} {
  return {
    error: undefined,
    working: false,
    registry_id: undefined,
    new_fa_icon: "question",
  };
}

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

function open(registry_id: string) {
  Object.assign(state, initialData());
  state.registry_id = registry_id;
  state.new_fa_icon =
    store!.collections.helmRegistries.getOne(registry_id)?.fa_icon;
  modal.value!.open();
}

function close() {
  modal.value!.close();
}

async function submit() {
  if (!state.registry_id) {
    return;
  }
  try {
    state.working = true;
    state.error = null;
    await store!.collections.helmRegistries.updateItem({
      id: state.registry_id,
      data: {
        fa_icon: state.new_fa_icon,
      },
    });
    modal.value!.close();
  } catch (error) {
    state.error = error;
    state.working = false;
  }
}

defineExpose({ open, close });
</script>
