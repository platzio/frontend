<template>
  <Modal
    ref="modal"
    title="Enable Deployment"
    size="lg"
    btn-class="btn-success"
    :error="error"
    :working="working"
    @submit="submit"
  >
    <div class="alert alert-primary">
      <div class="mb-1 fw-bold">
        <fa icon="exclamation-circle" />
        Careful
      </div>
      <div>
        You are about to enable this deployment
      </div>
    </div>

    <div class="border p-2" v-if="deployment">
      <Deployment :deployment="deployment" />
    </div>

    <div class="mt-3">
      Are you sure you want to continue?
    </div>
  </Modal>
</template>

<script lang="ts">
import Modal from "@/components/base/Modal.vue";
import { useStore } from "@/store";
import { Deployment } from "@/store/models/deployment";
import { defineComponent, reactive, ref, toRefs } from "vue";

function initialData(): {
  error: any;
  working: boolean;
  deployment?: Deployment;
} {
  return {
    error: undefined,
    working: false,
    deployment: undefined
  };
}

export default defineComponent({
  components: {
    Modal
  },

  setup(props, { emit }) {
    const store = useStore();
    const state = reactive({ ...initialData() });
    const modal = ref<typeof Modal>();

    function open(deployment: Deployment) {
      Object.assign(state, initialData());
      state.deployment = deployment;
      modal.value!.open();
    }

    function close() {
      modal.value!.close();
    }

    async function submit() {
      if (!state.deployment) {
        return;
      }
      try {
        state.working = true;
        state.error = null;
        await store!.collections.deployments.updateItem({
          id: state.deployment.id,
          data: {
            enabled: true
          }
        });
        modal.value!.close();
        emit("done");
      } catch (error) {
        state.error = error;
        state.working = false;
      }
    }

    return {
      modal,
      open,
      close,
      submit,
      ...toRefs(state)
    };
  }
});
</script>
