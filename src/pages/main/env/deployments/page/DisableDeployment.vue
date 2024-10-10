<template>
  <PlatzModal
    ref="modal"
    title="Disable Deployment"
    size="lg"
    btn-class="btn-warning text-light"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div class="alert alert-warning">
      <div class="mb-1 fw-bold">
        <FaIcon icon="exclamation-circle" />
        Careful
      </div>
      <div>You are about to disable this deployment</div>
    </div>

    <div class="border p-2" v-if="state.deployment">
      <PlatzDeployment :deployment="state.deployment" />
    </div>

    <div class="my-3">
      This would delete the deployment's namespace from the Kubernetes cluster.
      The deployment would remain off until you enable it again.
    </div>

    <div class="mt-3">Are you sure you want to continue?</div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { type Deployment } from "@platzio/sdk";
import { useStore } from "@/store";
import PlatzModal from "@/components/base/PlatzModal.vue";
import PlatzDeployment from "@/components/PlatzDeployment.vue";

function initialData(): {
  error: any;
  working: boolean;
  deployment?: Deployment;
} {
  return {
    error: null,
    working: false,
    deployment: undefined,
  };
}

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

const emit = defineEmits(["done"]);

function open(deployment: Deployment) {
  Object.assign(state, initialData());
  state.deployment = deployment;
  modal.value?.open();
}

function close() {
  modal.value?.close();
}

async function submit() {
  if (!state.deployment) {
    return;
  }
  try {
    state.working = true;
    state.error = null;
    await store?.collections.deployments.updateItem({
      id: state.deployment.id,
      data: {
        enabled: false,
      },
    });
    modal.value?.close();
    emit("done");
  } catch (error) {
    state.error = error;
    state.working = false;
  }
}

defineExpose({ open, close });
</script>
