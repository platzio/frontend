<template>
  <Modal
    ref="modal"
    title="Set Cluster Env"
    btn-class="btn-primary"
    size="lg"
    :error="error"
    :working="working"
    @submit="submit"
  >
    <div class="mb-2">
      This will set or move the following cluster between envs:
    </div>
    <div class="my-2 rounded border p-2" v-if="cluster">
      <K8sClusterName :id="cluster.id" />
    </div>
    <div class="my-3">
      <select class="form-select" v-model="env_id">
        <option :value="null">(no cluster)</option>
        <option v-for="env in envs" :value="env.id" :key="env.id">
          {{ env.name }}
        </option>
      </select>
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
  env_id?: string;
} {
  return {
    error: undefined,
    working: false,
    cluster: undefined,
    env_id: undefined,
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
    const envs = computed(() => store!.collections.envs.all);

    function open(cluster: K8sCluster) {
      Object.assign(state, initialData());
      state.cluster = cluster;
      state.env_id = cluster.env_id;
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
            env_id: state.env_id,
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
      envs,
      open,
      close,
      submit,
      ...toRefs(state),
    };
  },
});
</script>
