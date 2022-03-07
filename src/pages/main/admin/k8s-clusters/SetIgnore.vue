<template>
  <Modal
    ref="modal"
    :title="title"
    btn-class="btn-danger"
    size="lg"
    :error="error"
    :working="working"
    @submit="submit"
  >
    <div class="mb-2" v-if="ignore">
      You are about to <strong>IGNORE</strong> the following cluster:
    </div>
    <div class="mb-2" v-if="!ignore">
      You are about to <strong>UN-INGORE</strong> the following cluster:
    </div>
    <div class="my-3 rounded border p-3" v-if="cluster">
      <K8sClusterName :id="cluster.id" />
    </div>
    <div class="my-3 alert alert-danger">
      This can cause a lot of damage, please make sure you've read ALL the text
      in the cluster page to understand what you're about to do.
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from "vue";
import Modal from "@/components/base/Modal.vue";
import { useStore } from "@/store";
import { K8sCluster } from "@/store/models/k8s-cluster";

function initialData(): {
  error: any;
  working: boolean;
  cluster?: K8sCluster;
  ignore: boolean;
} {
  return {
    error: undefined,
    working: false,
    cluster: undefined,
    ignore: false
  };
}

export default defineComponent({
  components: {
    Modal
  },

  setup() {
    const store = useStore();
    const state = reactive({ ...initialData() });
    const modal = ref<typeof Modal>();
    const title = computed(() =>
      state.cluster && state.cluster.ignore
        ? "Un-Ignore Cluster"
        : "Ignore Cluster"
    );

    function open(cluster: K8sCluster) {
      Object.assign(state, initialData());
      state.cluster = cluster;
      state.ignore = !cluster.ignore;
      modal.value!.open();
    }

    function close() {
      modal.value!.close();
    }

    async function submit() {
      if (!state.cluster) {
        return;
      }
      try {
        state.working = true;
        state.error = null;
        await store!.collections.k8sClusters.updateItem({
          id: state.cluster.id,
          data: {
            ignore: state.ignore
          }
        });
        modal.value!.close();
      } catch (error) {
        state.error = error;
        state.working = false;
      }
    }

    return {
      modal,
      title,
      open,
      close,
      submit,
      ...toRefs(state)
    };
  }
});
</script>
