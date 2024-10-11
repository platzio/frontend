<template>
  <PlatzModal
    ref="modal"
    title="Configure Grafana"
    btn-class="btn-primary"
    size="lg"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div class="mb-3">
      This sets the Grafana "explore" URL and Loki data-source name for
      deployments running in this cluster.
    </div>

    <div class="mb-3 text-secondary">
      Set empty values to disable this feature.
    </div>

    <div class="mb-3 form-floating">
      <input
        id="grafana_url"
        v-model="state.grafana_url"
        type="text"
        class="form-control"
        aria-describedby="grafana_url"
        :disabled="state.working"
      />
      <label for="grafana_url" class="form-label">Grafana URL</label>
      <div class="form-text">
        Provide a full URL to the Grafana explore view, that would work for
        users outside the cluster, including http:// or https:// (e.g.
        https://my.grafana.instance/explore)
      </div>
    </div>

    <div class="mb-3 form-floating">
      <input
        id="grafana_datasource_name"
        v-model="state.grafana_datasource_name"
        type="text"
        class="form-control"
        aria-describedby="grafana_datasource_name"
        :disabled="state.working"
      />
      <label for="grafana_datasource_name" class="form-label">
        Loki Data-Source Name
      </label>
      <div class="form-text">The data-source is usually named "Loki"</div>
    </div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { type K8sCluster } from "@platzio/sdk";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { useStore } from "@/store";

function initialData(): {
  error: any;
  working: boolean;
  cluster?: K8sCluster;
  grafana_url?: string | null;
  grafana_datasource_name?: string | null;
} {
  return {
    error: undefined,
    working: false,
    cluster: undefined,
    grafana_url: null,
    grafana_datasource_name: null,
  };
}

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

function open(cluster: K8sCluster) {
  Object.assign(state, initialData());
  state.cluster = cluster;
  state.grafana_url = cluster.grafana_url;
  state.grafana_datasource_name = cluster.grafana_datasource_name;
  modal.value?.open();
}

function close() {
  modal.value?.close();
}

async function submit() {
  if (!state.cluster) {
    return;
  }
  try {
    state.working = true;
    state.error = null;
    await store?.collections.k8sClusters.updateItem({
      id: state.cluster.id,
      data: {
        grafana_url: state.grafana_url,
        grafana_datasource_name: state.grafana_datasource_name,
      },
    });
    modal.value?.close();
  } catch (error) {
    state.error = error;
    state.working = false;
  }
}

defineExpose({ open, close });
</script>
