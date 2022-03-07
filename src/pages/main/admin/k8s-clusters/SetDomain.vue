<template>
  <Modal
    ref="modal"
    title="Set Cluster Domain"
    btn-class="btn-primary"
    size="lg"
    :error="error"
    :working="working"
    @submit="submit"
  >
    <div class="mb-3">
      This sets a domain for the cluster, allowing deployments to automatically
      create ingresses using the deployment name and the domain set here:
    </div>

    <div class="mb-3 form-floating">
      <input
        type="text"
        class="form-control"
        id="domain"
        aria-describedby="domain"
        v-model="domain"
        required
        :disabled="working"
      />
      <label for="domain" class="form-label">
        Domain
      </label>
      <div id="domain" class="form-text">
        <fa icon="keyboard" class="ms-1" fixed-width />
        Enter a valid DNS name
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import Modal from "@/components/base/Modal.vue";
import { useStore } from "@/store";
import { K8sCluster } from "@/store/models/k8s-cluster";

function initialData(): {
  error: any;
  working: boolean;
  cluster?: K8sCluster;
  domain?: string;
} {
  return {
    error: undefined,
    working: false,
    cluster: undefined,
    domain: undefined
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

    function open(cluster: K8sCluster) {
      Object.assign(state, initialData());
      state.cluster = cluster;
      state.domain = cluster.domain;
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
            domain: state.domain
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
      open,
      close,
      submit,
      ...toRefs(state)
    };
  }
});
</script>
