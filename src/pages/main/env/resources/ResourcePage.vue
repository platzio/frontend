<template>
  <div v-if="resourceType">
    <div class="d-flex flex-row justify-content-between align-items-start">
      <div class="d-flex flex-row align-items-center">
        <div class="h1 me-3" v-if="formatted">
          <FaIcon v-if="formatted.icon" :icon="formatted.icon" fixed-width />
          {{ formatted.text }}
        </div>
      </div>

      <div class="dropdown" v-if="canEdit">
        <a
          class="btn btn-outline-primary"
          href="#"
          role="button"
          id="actionsDropdown"
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

    <ResourceReason class="my-3" v-if="resource" :resource="resource" />

    <div class="my-3" v-if="resource">
      <div v-if="resourceType.spec.values_ui">
        <div
          v-for="input in resourceType.spec.values_ui.inputs"
          :key="input.id"
          class="mt-2"
        >
          <ConfigValue
            :input="input"
            :envId="envId"
            :value="resource.props[input.id]"
            :allValues="resource.props"
          />
        </div>
      </div>
    </div>

    <div class="my-3 card">
      <div class="card-header">Managed By</div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item" v-if="managingDeployment">
          <PlatzDeployment :deployment="managingDeployment" />
        </li>
        <li class="list-group-item text-body-secondary text-center" v-else>
          This {{ resourceType.spec.name_singular }} is not managed by any
          deployment
        </li>
      </ul>
    </div>

    <div class="my-3 card" v-if="deployments">
      <div class="card-header">Using Deployments</div>
      <div class="list-group list-group-flush">
        <div
          class="list-group-item"
          v-for="deployment in deployments"
          :key="deployment.id"
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
      :envId="envId"
      :resourceTypeId="resourceTypeId"
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

const env = computed(() => store!.collections.envs.getOne(props.envId));

const resource = computed(() =>
  store!.collections.deploymentResources.getOne(props.id)
);

const resourceType = computed(() =>
  store!.collections.deploymentResourceTypes.getOne(props.resourceTypeId)
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
    ? store!.collections.deploymentResources.formatItem(resource.value)
    : undefined
);

const managingDeployment = computed(
  () =>
    resource.value?.deployment_id &&
    store!.collections.deployments.getOne(resource.value.deployment_id)
);

const deploymentKind = computed(() =>
  resourceType.value
    ? store!.collections.deploymentKinds.getOne(
        resourceType.value.deployment_kind_id
      )
    : undefined
);

const deployments = computed(() =>
  resourceType.value && deploymentKind.value
    ? findCollectionDependencies(resourceType.value.key, props.id).concat(
        findCollectionDependencies(
          {
            deployment: deploymentKind.value.name,
            type: resourceType.value.key,
          },
          props.id
        )
      )
    : undefined
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
