<template>
  <Modal
    ref="modal"
    title="Configure Grafana"
    btn-class="btn-primary"
    size="lg"
    :error="error"
    :working="working"
    @submit="submit"
  >
    <div class="mb-3">
      This sets the Grafana URL and Loki data-source name for deployments
      running in this cluster.
    </div>

    <div class="mb-3 text-secondary">
      Set empty values to disable this feature.
    </div>

    <div class="mb-3 form-floating">
      <input
        type="text"
        class="form-control"
        id="grafana_url"
        aria-describedby="grafana_url"
        v-model="grafana_url"
        :disabled="working"
      />
      <label for="grafana_url" class="form-label">Grafana URL</label>
      <div class="form-text">
        Provide a full URL that would work for users outside the cluster,
        including http:// or https://
      </div>
    </div>

    <div class="mb-3 form-floating">
      <input
        type="text"
        class="form-control"
        id="grafana_datasource_name"
        aria-describedby="grafana_datasource_name"
        v-model="grafana_datasource_name"
        :disabled="working"
      />
      <label for="grafana_datasource_name" class="form-label">
        Loki Data-Source Name
      </label>
      <div class="form-text">The data-source is usually named "Loki"</div>
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
  grafana_url?: string;
  grafana_datasource_name?: string;
} {
  return {
    error: undefined,
    working: false,
    cluster: undefined,
    grafana_url: undefined,
    grafana_datasource_name: undefined,
  };
}

export default defineComponent({
  components: {
    Modal,
  },

  setup() {
    const store = useStore();
    const state = reactive({ ...initialData() });
    const modal = ref<typeof Modal>();

    function open(cluster: K8sCluster) {
      Object.assign(state, initialData());
      state.cluster = cluster;
      state.grafana_url = cluster.grafana_url;
      state.grafana_datasource_name = cluster.grafana_datasource_name;
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
            grafana_url: state.grafana_url,
            grafana_datasource_name: state.grafana_datasource_name,
          },
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
      ...toRefs(state),
    };
  },
});
</script>
