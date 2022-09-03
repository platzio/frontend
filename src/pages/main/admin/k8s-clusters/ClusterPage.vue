<template>
  <div>
    <div class="d-flex flex-row align-items-center">
      <div class="h1">
        <PlatzClusterName :id="cluster.id" :showRegion="false" />
      </div>
      <span class="ms-3 badge bg-secondary" v-if="cluster.ignore"> IGNORED </span>
    </div>

    <div class="my-2 text-secondary">
      <FaIcon icon="globe" fixed-width />
      {{ cluster.region_name }}
    </div>

    <div class="my-1 small text-danger" v-if="!cluster.ignore && !cluster.is_ok">
      <FaIcon icon="exclamation-triangle" fixed-width />
      {{ cluster.not_ok_reason }}
    </div>

    <div class="my-4 card">
      <div class="card-header">Cluster Env</div>
      <div class="card-body" v-if="cluster.env_id">
        <div>This cluster is currently assigned to the following env:</div>
        <div class="my-3 h5">
          <PlatzEnv :id="cluster.env_id" :showInfo="false" />
        </div>
        <div class="my-2">
          You can change the env, which would immediately move all of its deployments to the new
          env.
        </div>
        <div class="my-2">
          If you unassign the env without first shutting down its deployments, all deployments would
          keep on running without you or anyone else being able to control them until a new cluster
          is assigned.
        </div>
        <div class="mt-3">
          <button class="btn btn-outline-primary" @click="changeEnv && changeEnv.open(cluster)">
            Change Cluster Env
          </button>
        </div>
      </div>
      <div class="card-body" v-else>
        <div>
          This cluster is not assigned to any env. This means that nobody can run deployments on it.
        </div>
        <div>A cluster can only be assigned to one env.</div>
        <div class="mt-3">
          <button class="btn btn-primary" @click="changeEnv && changeEnv.open(cluster)">
            Set Cluster Env
          </button>
        </div>
      </div>
    </div>

    <div class="my-4 card">
      <div class="card-header">Ingress Settings</div>
      <div class="card-body">
        <div class="mb-2">
          These settings control the injected ingress section when installing deployments.
        </div>
        <div class="mb-2">
          When a deployment has the ingress feature enabled in its features.yaml, Platz creates a
          domain name under the ingress domain. If an ingress class is set, it's also injected to
          the deployment chart values when installing.
        </div>
        <div class="mb-2">
          Ingress TLS secret name turns on TLS for the ingress. Note that Platz doesn't check if the
          secret exists: This allows for using both a wildcard certificate replicated to all
          namespaces by services such as Reflector, or having a certificate created in the chart
          itself.
        </div>
        <div class="my-3">
          <span>Ingress Domain: </span>
          <span class="fw-bold" v-if="cluster.ingress_domain">
            {{ cluster.ingress_domain }}
          </span>
          <span class="text-muted fst-italic" v-else>(not set)</span>
        </div>
        <div class="my-3">
          <span>Ingress Class: </span>
          <span class="fw-bold" v-if="cluster.ingress_class">
            {{ cluster.ingress_class }}
          </span>
          <span class="text-muted fst-italic" v-else>(not set)</span>
        </div>
        <div class="my-3">
          <span>TLS Secret Name: </span>
          <span class="fw-bold" v-if="cluster.ingress_tls_secret_name">
            {{ cluster.ingress_tls_secret_name }}
          </span>
          <span class="text-muted fst-italic" v-else>(not set)</span>
        </div>

        <button
          class="btn btn-outline-primary"
          @click="editIngressSettings && editIngressSettings.open(cluster)"
        >
          Edit Ingress Settings
        </button>
      </div>
    </div>

    <div class="my-4 card">
      <div class="card-header">Ignore Cluster</div>
      <div class="card-body" v-if="cluster.ignore">
        <div class="mb-2">
          This cluster is currently
          <strong class="text-danger">ignored</strong>.
        </div>
        <div class="my-2">
          This means that Platz doesn't track its status and any deployments running in it are
          completely ignored.
        </div>
        <div class="my-2">
          You can un-ignore the cluster, which would cause Platz to resume monitoring the cluster.
        </div>
        <div class="mt-3">
          <button class="btn btn-outline-primary" @click="setIgnore && setIgnore.open(cluster)">
            <FaIcon icon="volume-up" fixed-width />
            Un-ignore Cluster
          </button>
        </div>
      </div>
      <div class="card-body" v-else>
        <div class="mb-2">
          This cluster is <strong class="text-success">not ignored</strong>. Platz monitors this
          cluster and all of its deployments.
        </div>
        <div class="my-2">
          If you ignore this cluster, Platz will stop monitoring it. This is useful when clusters
          are taken down, allowing Platz to keep a full history of all actions that happened on old
          clusters, such as moving or renaming deployments.
        </div>
        <div class="mt-3">
          <button class="btn btn-outline-secondary" @click="setIgnore && setIgnore.open(cluster)">
            <FaIcon icon="volume-mute" fixed-width />
            Ignore Cluster
          </button>
        </div>
      </div>
    </div>

    <div class="my-4 card">
      <div class="card-header">Grafana</div>
      <div class="card-body">
        <div class="mb-3">
          Configure a Grafana URL and a Loki data-source name to show an "Open Logs" action for
          deployments running in this cluster.
        </div>
        <div class="my-3">
          <span>URL: </span>
          <span class="fw-bold" v-if="cluster.grafana_url">{{ cluster.grafana_url }}</span>
          <span class="text-muted fst-italic" v-else>(not set)</span>
        </div>
        <div class="my-3">
          <span>Data-Source Name: </span>
          <span class="fw-bold" v-if="cluster.grafana_datasource_name">{{
            cluster.grafana_datasource_name
          }}</span>
          <span class="text-muted fst-italic" v-else>(not set)</span>
        </div>
        <div>
          <button class="btn btn-outline-primary" @click="setGrafana && setGrafana.open(cluster)">
            Change Cluster Grafana Configuration
          </button>
        </div>
      </div>
    </div>

    <div class="my-4 card">
      <div class="card-header">Deployments ({{ deployments.length }})</div>
      <PlatzCollection :items="deployments" :flush="true">
        <template #item="scope">
          <PlatzCollectionItem>
            <PlatzDeployment :deployment="scope.item" />
          </PlatzCollectionItem>
        </template>
      </PlatzCollection>
    </div>

    <ChangeEnv ref="changeEnv" />
    <EditIngressSettings ref="editIngressSettings" />
    <SetIgnore ref="setIgnore" />
    <SetGrafana ref="setGrafana" />
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { computed, defineComponent, ref } from "vue";
import ChangeEnv from "./ChangeEnv.vue";
import EditIngressSettings from "./EditIngressSettings.vue";
import SetIgnore from "./SetIgnore.vue";
import SetGrafana from "./SetGrafana.vue";

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  components: {
    ChangeEnv,
    EditIngressSettings,
    SetIgnore,
    SetGrafana,
  },

  setup(props) {
    const store = useStore();
    const changeEnv = ref<typeof ChangeEnv>();
    const editIngressSettings = ref<typeof EditIngressSettings>();
    const setIgnore = ref<typeof SetIgnore>();
    const setGrafana = ref<typeof SetGrafana>();
    const cluster = computed(() => store!.collections.k8sClusters.getOne(props.id));

    const deployments = computed(() =>
      store!.collections.deployments.all.filter((deploy) => deploy.cluster_id == props.id)
    );

    return {
      cluster,
      changeEnv,
      deployments,
      editIngressSettings,
      setIgnore,
      setGrafana,
    };
  },
});
</script>
