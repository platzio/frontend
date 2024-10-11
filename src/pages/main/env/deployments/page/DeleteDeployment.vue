<template>
  <PlatzModal
    ref="modal"
    title="Delete Deployment"
    size="lg"
    btn-class="btn-danger"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div class="alert alert-danger">
      <div class="mb-1 fw-bold">
        <FaIcon icon="exclamation-circle" />
        Careful
      </div>
      <div>You are about to delete this deployment</div>
    </div>

    <div v-if="deployment" class="border p-2">
      <PlatzDeployment :deployment="deployment" />
    </div>

    <div class="mt-3">Are you sure you want to continue?</div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import PlatzModal from "@/components/base/PlatzModal.vue";
import PlatzDeployment from "@/components/PlatzDeployment.vue";
import { useStore } from "@/store";

function initialData(): { error: any; working: boolean; id?: string } {
  return {
    error: undefined,
    working: false,
    id: undefined,
  };
}

const modal = ref<typeof PlatzModal>();
const state = reactive({ ...initialData() });
const emit = defineEmits(["done"]);

const store = useStore();
const deployment = computed(() =>
  state.id ? store?.collections.deployments.getOne(state.id) : undefined
);

function open(id: string) {
  Object.assign(state, initialData());
  state.id = id;
  modal.value?.open();
}

function close() {
  modal.value?.close();
}

async function submit() {
  if (!state.id) {
    return;
  }
  try {
    state.working = true;
    state.error = null;
    await store?.collections.deployments.deleteItem(state.id);
    modal.value?.close();
    emit("done");
  } catch (error) {
    state.error = error;
    state.working = false;
  }
}

defineExpose({ open, close });
</script>
