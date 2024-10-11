<template>
  <div v-if="resources">
    <PlatzCollection :items="resources">
      <template #item="{ item }">
        <PlatzItemWithActions>
          <template #contents>
            <div class="my-1 fw-bold d-flex flex-row align-items-baseline">
              <PlatzResourceStatus :id="item.id" class="me-2" />
              <div>{{ item.name }}</div>
            </div>
            <div class="my-1 small text-secondary">
              Kubernetes {{ item.kind }} ({{ item.api_version }})
            </div>
          </template>
          <template #actions>
            <li>
              <a
                class="dropdown-item"
                :class="{ disabled: !isMaintainer }"
                @click="restartResource(item)"
              >
                <FaIcon icon="sync" fixed-width />
                Restart {{ item.kind }}
              </a>
            </li>
          </template>
        </PlatzItemWithActions>
      </template>
    </PlatzCollection>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type K8sResource } from "@platzio/sdk";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzItemWithActions from "@/components/collection/PlatzItemWithActions.vue";
import PlatzResourceStatus from "@/components/PlatzResourceStatus.vue";
import { useStore } from "@/store";
import { isDeploymentMaintainer } from "@/store/permissions";

const props = defineProps<{
  envId: string;
  id: string;
  kind?: string;
}>();

const store = useStore();
const deployment = computed(() =>
  store?.collections.deployments.getOne(props.id)
);

const isMaintainer = computed(() =>
  deployment.value
    ? isDeploymentMaintainer(props.envId, deployment.value.kind_id)
    : undefined
);

const resources = computed(() =>
  store?.collections.k8sResources.all
    .filter((resource) => resource.deployment_id == props.id)
    .filter((resource) => resource.kind != "Job")
);

const restartResource = async (resource: K8sResource) => {
  await store?.collections.deploymentTasks.createItem({
    deployment_id: resource.deployment_id,
    operation: {
      RestartK8sResource: {
        resource_id: resource.id,
        resource_name: resource.name,
      },
    },
  });
};
</script>
