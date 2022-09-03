<template>
  <PlatzModal
    ref="modal"
    title="Edit Ingress Settings"
    btn-class="btn-primary"
    size="lg"
    :error="error"
    :working="working"
    @submit="submit"
  >
    <div class="mb-2">
      These settings control the injected ingress section when installing deployments.
    </div>

    <div class="mb-2">
      When a deployment has the ingress feature enabled in its features.yaml, Platz creates a domain
      name under the ingress domain. If an ingress class is set, it's also injected to the
      deployment chart values when installing.
    </div>

    <div class="mb-2">
      Ingress TLS secret name turns on TLS for the ingress. Note that Platz doesn't check if the
      secret exists: This allows for using both a wildcard certificate replicated to all namespaces
      by services such as Reflector, or having a certificate created in the chart itself.
    </div>

    <div class="mb-3 form-floating">
      <input
        type="text"
        class="form-control"
        id="ingress_domain"
        aria-describedby="domain"
        v-model="ingress_domain"
        required
        :disabled="working"
      />
      <label for="ingress_domain" class="form-label">Ingress Domain</label>
      <div class="form-text">
        <FaIcon icon="keyboard" class="ms-1" fixed-width />
        Enter a valid DNS name
      </div>
    </div>

    <div class="mb-3 form-floating">
      <input
        type="text"
        class="form-control"
        id="ingress_class"
        aria-describedby="domain"
        v-model="ingress_class"
        :disabled="working"
      />
      <label for="ingress_class" class="form-label">Ingress Class</label>
      <div class="form-text">
        An ingress class might not be required if the cluster has a default ingress class
      </div>
    </div>

    <div class="mb-3 form-floating">
      <input
        type="text"
        class="form-control"
        id="ingress_tls_secret_name"
        aria-describedby="ingress_tls_secret_name"
        v-model="ingress_tls_secret_name"
        required
        :disabled="working"
      />
      <label for="ingress_tls_secret_name" class="form-label">Ingress TLS Secret Name</label>
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
  ingress_domain?: string;
  ingress_class?: string;
  ingress_tls_secret_name?: string;
} {
  return {
    error: undefined,
    working: false,
    cluster: undefined,
    ingress_domain: undefined,
    ingress_class: undefined,
    ingress_tls_secret_name: undefined,
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
      state.ingress_domain = cluster.ingress_domain;
      state.ingress_class = cluster.ingress_class;
      state.ingress_tls_secret_name = cluster.ingress_tls_secret_name;
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
            ingress_domain: state.ingress_domain,
            ingress_class: state.ingress_class,
            ingress_tls_secret_name: state.ingress_tls_secret_name,
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
