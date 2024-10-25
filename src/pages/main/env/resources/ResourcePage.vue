<template>
  <div v-if="resourceType">
    <div class="d-flex flex-row justify-content-between align-items-start">
      <div class="d-flex flex-row align-items-center">
        <div v-if="formatted" class="h1 me-3">
          <FaIcon v-if="formatted.icon" :icon="formatted.icon" fixed-width />
          {{ formatted.text }}
        </div>
      </div>

      <div v-if="canEdit" class="dropdown">
        <a
          id="actionsDropdown"
          class="btn btn-outline-primary"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Actions
          <FaIcon icon="angle-down" fixed-width />
        </a>
        <ul class="dropdown-menu" aria-labelledby="actionsDropdown">
          <li v-if="canEdit">
            <a class="dropdown-item" @click="editResource?.open(resource)">
              <FaIcon icon="edit" fixed-width />
              Edit {{ resourceType.spec.name_singular }}
            </a>
          </li>
          <template v-if="canDelete && resource">
            <li class="dropdown-divider" />
            <li>
              <a
                class="dropdown-item"
                @click="deleteResource?.open(resource.id)"
              >
                <FaIcon icon="trash" fixed-width />
                Delete {{ resourceType.spec.name_singular }}
              </a>
            </li>
          </template>
        </ul>
      </div>
    </div>

    <ResourceReason v-if="resource" class="my-3" :resource="resource" />

    <div v-if="resource" class="my-3">
      <div v-if="resourceType.spec.values_ui">
        <div
          v-for="input in resourceType.spec.values_ui.inputs"
          :key="input.id"
          class="mt-2"
        >
          <ConfigValue
            :input="input"
            :env-id="envId"
            :value="resource.props[input.id]"
            :all-values="resource.props"
          />
        </div>
      </div>
    </div>

    <div class="my-3 card">
      <div class="card-header">Managed By</div>
      <ul class="list-group list-group-flush">
        <li v-if="managingDeployment" class="list-group-item">
          <PlatzDeployment :deployment="managingDeployment" />
        </li>
        <li v-else class="list-group-item text-body-secondary text-center">
          This {{ resourceType.spec.name_singular }} is not managed by any
          deployment
        </li>
      </ul>
    </div>

    <div v-if="deployments" class="my-3 card">
      <div class="card-header">Using Deployments</div>
      <div class="list-group list-group-flush">
        <div
          v-for="deployment in deployments"
          :key="deployment.id"
          class="list-group-item"
        >
          <PlatzDeployment :deployment="deployment" />
        </div>
        <div
          v-if="deployments.length === 0"
          class="my-5 text-body-secondary text-center"
        >
          No deployments are using this
          {{ resourceType.spec.name_singular }}
        </div>
      </div>
    </div>

    <EditResource
      ref="editResource"
      :env-id="envId"
      :resource-type-id="resourceTypeId"
    />
    <DeleteResource ref="deleteResource" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { useHead } from "@vueuse/head";
import ConfigValue from "@/components/values/ConfigValue.vue";
import PlatzDeployment from "@/components/PlatzDeployment.vue";
import { useStore } from "@/store";
import { findCollectionDependencies } from "@/store/deployments";
import EditResource from "./EditResource.vue";
import DeleteResource from "./DeleteResource.vue";
import ResourceReason from "./ResourceReason.vue";

const props = defineProps<{
  envId: string;
  resourceTypeId: string;
  id: string;
}>();

const store = useStore();
const editResource = ref<typeof EditResource>();
const deleteResource = ref<typeof DeleteResource>();

const env = computed(() => store?.collections.envs.getOne(props.envId));

const resource = computed(() =>
  store?.collections.deploymentResources.getOne(props.id)
);

const resourceType = computed(() =>
  store?.collections.deploymentResourceTypes.getOne(props.resourceTypeId)
);

const canEdit = computed(
  () =>
    resourceType.value?.spec.lifecycle &&
    resourceType.value?.spec.lifecycle.update
);

const canDelete = computed(
  () =>
    resourceType.value?.spec.lifecycle &&
    resourceType.value?.spec.lifecycle.delete
);

const formatted = computed(() =>
  resource.value
    ? store?.collections.deploymentResources.formatItem(resource.value)
    : undefined
);

const managingDeployment = computed(
  () =>
    resource.value?.deployment_id &&
    store?.collections.deployments.getOne(resource.value.deployment_id)
);

const deploymentKind = computed(() =>
  resourceType.value
    ? store?.collections.deploymentKinds.getOne(
        resourceType.value.deployment_kind_id
      )
    : undefined
);

const deployments = computed(
  () =>
    store &&
    resourceType.value &&
    deploymentKind.value &&
    findCollectionDependencies(store, resourceType.value.key, props.id).concat(
      findCollectionDependencies(
        store,
        {
          deployment: deploymentKind.value.name,
          type: resourceType.value.key,
        },
        props.id
      )
    )
);

onBeforeRouteUpdate((to) => {
  if (to.params.envId !== props.envId) {
    return {
      name: "env.resources.list",
      params: {
        envId: to.params.envId,
      },
    };
  }
});

useHead({
  title: computed(
    () =>
      `${resource.value?.name || "..."} - ${
        resourceType.value?.spec.name_plural || "..."
      } - ${env.value?.name || "..."} - Platz`
  ),
});
</script>
