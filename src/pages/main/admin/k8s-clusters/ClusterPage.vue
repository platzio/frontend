<template>
  <div>
    <div class="d-flex flex-row align-items-center">
      <div class="h1">
        <K8sClusterName :id="cluster.id" :showRegion="false" />
      </div>
      <span class="ms-3 badge bg-secondary" v-if="cluster.ignore">
        IGNORED
      </span>
    </div>

    <div class="my-2 text-secondary">
      <fa icon="globe" fixed-width />
      {{ cluster.region_name }}
    </div>

    <div
      class="my-1 small text-danger"
      v-if="!cluster.ignore && !cluster.is_ok"
    >
      <fa icon="exclamation-triangle" fixed-width />
      {{ cluster.not_ok_reason }}
    </div>

    <div class="my-4 card">
      <div class="card-header">Cluster Env</div>
      <div class="card-body" v-if="cluster.env_id">
        <div>This cluster is currently assigned to the following env:</div>
        <div class="my-3 h5">
          <Env :id="cluster.env_id" :showInfo="false" />
        </div>
        <div class="my-2">
          You can change the env, which would immediately move all of its
          deployments to the new env.
        </div>
        <div class="my-2">
          If you unassign the env without first shutting down its deployments,
          all deployments would keep on running without you or anyone else being
          able to control them until a new cluster is assigned.
        </div>
        <div class="mt-3">
          <button
            class="btn btn-outline-primary"
            @click="changeEnv && changeEnv.open(cluster)"
          >
            Change Cluster Env
          </button>
        </div>
      </div>
      <div class="card-body" v-else>
        <div>
          This cluster is not assigned to any env. This means that nobody can
          run deployments on it.
        </div>
        <div>A cluster can only be assigned to one env.</div>
        <div class="mt-3">
          <button
            class="btn btn-primary"
            @click="changeEnv && changeEnv.open(cluster)"
          >
            Set Cluster Env
          </button>
        </div>
      </div>
    </div>

    <div class="my-4 card">
      <div class="card-header">Domain</div>
      <div class="card-body">
        <div class="mb-3">
          When assigned, a cluster domain lets Platz allocate a domain name for
          each deployment. These deployments can then use the domain name and
          create an ingress for their services.
        </div>
        <div v-if="cluster.domain">
          <div class="my-3 h5 fw-bold">
            {{ cluster.domain }}
          </div>
          <div>
            <button
              class="btn btn-outline-primary"
              @click="setDomain && setDomain.open(cluster)"
            >
              Change Cluster Domain
            </button>
          </div>
        </div>
        <div v-else>
          <div class="my-3 h5 text-muted fst-italic">No domain is set</div>
          <div>
            <button
              class="btn btn-primary"
              @click="setDomain && setDomain.open(cluster)"
            >
              Set Cluster Domain
            </button>
          </div>
        </div>
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
          This means that Platz doesn't track its status and any deployments
          running in it are completely ignored.
        </div>
        <div class="my-2">
          You can un-ignore the cluster, which would cause Platz to resume
          monitoring the cluster.
        </div>
        <div class="mt-3">
          <button
            class="btn btn-outline-primary"
            @click="setIgnore && setIgnore.open(cluster)"
          >
            <fa icon="volume-up" fixed-width />
            Un-ignore Cluster
          </button>
        </div>
      </div>
      <div class="card-body" v-else>
        <div class="mb-2">
          This cluster is <strong class="text-success">not ignored</strong>.
          Platz monitors this cluster and all of its deployments.
        </div>
        <div class="my-2">
          If you ignore this cluster, Platz will stop monitoring it. This is
          useful when clusters are taken down, allowing Platz to keep a full
          history of all actions that happened on old clusters, such as moving
          or renaming deployments.
        </div>
        <div class="mt-3">
          <button
            class="btn btn-outline-secondary"
            @click="setIgnore && setIgnore.open(cluster)"
          >
            <fa icon="volume-mute" fixed-width />
            Ignore Cluster
          </button>
        </div>
      </div>
    </div>

    <div class="my-4 card">
      <div class="card-header">Deployments ({{ deployments.length }})</div>
      <Collection :items="deployments" :flush="true">
        <template #item="scope">
          <CollectionItem>
            <Deployment :deployment="scope.item" />
          </CollectionItem>
        </template>
      </Collection>
    </div>

    <ChangeEnv ref="changeEnv" />
    <SetDomain ref="setDomain" />
    <SetIgnore ref="setIgnore" />
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { computed, defineComponent, ref } from "vue";
import ChangeEnv from "./ChangeEnv.vue";
import SetDomain from "./SetDomain.vue";
import SetIgnore from "./SetIgnore.vue";

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  components: {
    ChangeEnv,
    SetDomain,
    SetIgnore,
  },

  setup(props) {
    const store = useStore();
    const changeEnv = ref<typeof ChangeEnv>();
    const setDomain = ref<typeof SetDomain>();
    const setIgnore = ref<typeof SetIgnore>();
    const cluster = computed(() =>
      store!.collections.k8sClusters.getOne(props.id)
    );

    const deployments = computed(() =>
      store!.collections.deployments.all.filter(
        (deploy) => deploy.cluster_id == props.id
      )
    );

    return {
      cluster,
      changeEnv,
      deployments,
      setDomain,
      setIgnore,
    };
  },
});
</script>
