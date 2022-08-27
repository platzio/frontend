<template>
  <PlatzModal
    ref="modal"
    title="Set Cluster Domain"
    btn-class="btn-primary"
    size="lg"
    :error="error"
    :working="working"
    @submit="submit"
  >
    <div class="mb-3">
      This sets a domain for the cluster, allowing deployments to automatically create an ingress
      using the deployment name and the domain set here.
    </div>

    <div class="mb-3">
      The TLS secret name is a Kubernetes secret for configuring TLS for the ingress. The secret is
      usually managed automatically by cert-manager.
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
      <label for="domain" class="form-label">Domain</label>
      <div id="domain" class="form-text">
        <FaIcon icon="keyboard" class="ms-1" fixed-width />
        Enter a valid DNS name
      </div>
    </div>

    <div class="mb-3 form-floating">
      <input
        type="text"
        class="form-control"
        id="domain_tls_secret_name"
        aria-describedby="domain_tls_secret_name"
        v-model="domain_tls_secret_name"
        required
        :disabled="working"
      />
      <label for="domain_tls_secret_name" class="form-label"> TLS Secret Name </label>
    </div>
  </PlatzModal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { useStore } from "@/store";
import { K8sCluster } from "@/store/models/k8s-cluster";

function initialData(): {
  error: any;
  working: boolean;
  cluster?: K8sCluster;
  domain?: string;
  domain_tls_secret_name?: string;
} {
  return {
    error: undefined,
    working: false,
    cluster: undefined,
    domain: undefined,
    domain_tls_secret_name: undefined,
  };
}

export default defineComponent({
  components: {
    PlatzModal,
  },

  setup() {
    const store = useStore();
    const state = reactive({ ...initialData() });
    const modal = ref<typeof PlatzModal>();

    function open(cluster: K8sCluster) {
      Object.assign(state, initialData());
      state.cluster = cluster;
      state.domain = cluster.domain;
      state.domain_tls_secret_name = cluster.domain_tls_secret_name;
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
            domain: state.domain,
            domain_tls_secret_name: state.domain_tls_secret_name,
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
