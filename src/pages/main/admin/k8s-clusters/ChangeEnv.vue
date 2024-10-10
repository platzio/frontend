<template>
  <PlatzModal
    ref="modal"
    title="Set Cluster Env"
    btn-class="btn-primary"
    size="lg"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div class="mb-2">
      This will set or move the following cluster between envs:
    </div>
    <div class="my-2 rounded border p-2" v-if="state.cluster">
      <PlatzClusterName :id="state.cluster.id" />
    </div>
    <div class="my-3">
      <select class="form-select" v-model="state.env_id">
        <option :value="null">(No Env)</option>
        <option v-for="env in envs" :value="env.id" :key="env.id">
          {{ env.name }}
        </option>
      </select>
    </div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { type K8sCluster } from "@platzio/sdk";
import PlatzModal from "@/components/base/PlatzModal.vue";
import PlatzClusterName from "@/components/PlatzClusterName.vue";
import { useStore } from "@/store";

function initialData(): {
  error: any;
  working: boolean;
  cluster?: K8sCluster;
  env_id?: string | null;
} {
  return {
    error: undefined,
    working: false,
    cluster: undefined,
    env_id: undefined,
  };
}

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();
const envs = computed(() => store?.collections.envs.all);

function open(cluster: K8sCluster) {
  Object.assign(state, initialData());
  state.cluster = cluster;
  state.env_id = cluster.env_id;
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
        env_id: state.env_id,
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
