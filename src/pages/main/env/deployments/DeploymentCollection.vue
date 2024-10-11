<template>
  <div v-if="filteredDeployments">
    <PlatzCollection :items="filteredDeployments">
      <template #item="{ item }">
        <PlatzLinkedItem
          :to="{
            name: 'env.deployments.page',
            params: { envId, kindId, id: item.id },
          }"
          append
        >
          <PlatzDeployment :deployment="item" :show-primary-metric="true" />
        </PlatzLinkedItem>
      </template>

      <template #globalActions>
        <div class="d-flex flex-row align-items-center justify-content-end">
          <div class="form-check form-switch">
            <input
              v-if="allDisabled"
              id="showAll"
              class="form-check-input"
              type="checkbox"
              :checked="true"
              :disabled="true"
            />
            <input
              v-else
              id="showAll"
              v-model="showAll"
              class="form-check-input"
              type="checkbox"
            />
            <label class="form-check-label" for="showAll">Show All</label>
          </div>
          <DeploymentCollectionActions :env-id="envId" :kind-id="kindId" />
        </div>
      </template>

      <template #emptyTitle> No {{ kind?.name }} Deployments </template>

      <template #emptyAction>
        <button
          v-if="isOwner"
          class="btn btn-lg btn-primary"
          @click="editDeployment && editDeployment.openForCreate(kind)"
        >
          <FaIcon icon="plus" fixed-width />
          Create Deployment
        </button>
      </template>
    </PlatzCollection>
    <EditDeployment ref="editDeployment" :env-id="envId" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useHead } from "@vueuse/head";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzLinkedItem from "@/components/collection/PlatzLinkedItem.vue";
import PlatzDeployment from "@/components/PlatzDeployment.vue";
import { useStore } from "@/store";
import { isDeploymentOwner } from "@/store/permissions";
import DeploymentCollectionActions from "./DeploymentCollectionActions.vue";
import EditDeployment from "./EditDeployment.vue";

const props = defineProps<{
  envId: string;
  kindId: string;
}>();

const store = useStore();
const editDeployment = ref<typeof EditDeployment>();
const showAll = ref(false);

const env = computed(() => store?.collections.envs.getOne(props.envId));
const kind = computed(() =>
  store?.collections.deploymentKinds.getOne(props.kindId)
);

const isOwner = computed(() => isDeploymentOwner(props.envId, props.kindId));

const deployments = computed(() =>
  store?.collections.deployments.all.filter(
    (deployment) =>
      deployment.kind_id === props.kindId &&
      store?.collections.k8sClusters.getOne(deployment.cluster_id)?.env_id ===
        props.envId
  )
);

const allDisabled = computed(
  () =>
    deployments.value &&
    deployments.value.length > 0 &&
    deployments.value.every((deployment) => !deployment.enabled)
);

const filteredDeployments = computed(() =>
  deployments.value?.filter(
    (deployment) => deployment.enabled || showAll.value || allDisabled.value
  )
);

useHead({
  title: computed(
    () =>
      `${kind.value?.name || "..."} - Deployments - ${
        env.value?.name || "..."
      } - Platz`
  ),
});
</script>
