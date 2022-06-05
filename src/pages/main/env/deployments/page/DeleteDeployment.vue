<template>
  <Modal
    ref="modal"
    title="Delete Deployment"
    size="lg"
    btn-class="btn-danger"
    :error="error"
    :working="working"
    @submit="submit"
  >
    <div class="alert alert-danger">
      <div class="mb-1 fw-bold">
        <fa icon="exclamation-circle" />
        Careful
      </div>
      <div>
        You are about to delete this deployment
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
import { computed, defineComponent, reactive, ref, toRefs } from "vue";
import Modal from "@/components/base/Modal.vue";
import { useStore } from "@/store";

function initialData(): { error: any; working: boolean; id?: string } {
  return {
    error: undefined,
    working: false,
    id: undefined
  };
}

export default defineComponent({
  components: {
    Modal
  },

  setup(props, { emit }) {
    const modal = ref<typeof Modal>();
    const state = reactive({ ...initialData() });

    const store = useStore();
    const deployment = computed(() =>
      state.id ? store!.collections.deployments.getOne(state.id) : undefined
    );

    function open(id: string) {
      Object.assign(state, initialData());
      state.id = id;
      modal.value!.open();
    }

    function close() {
      modal.value!.close();
    }

    async function submit() {
      if (!state.id) {
        return;
      }
      try {
        state.working = true;
        state.error = null;
        await store!.collections.deployments.deleteItem(state.id);
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
      deployment,
      ...toRefs(state)
    };
  }
});
</script>
