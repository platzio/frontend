<template>
  <div>
    <div>
      <FaIcon icon="city" fixed-width />
      {{ env?.name }}
    </div>
    <div v-if="showInfo" class="mt-1 small text-body-secondary">
      {{ userCount === 1 ? "1 user" : `${userCount} users` }},
      {{
        deploymentCount === 1
          ? "1 deployment"
          : `${deploymentCount} deployments`
      }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore, useEnvScope } from "@/store";

const props = withDefaults(
  defineProps<{
    id: string;
    showInfo?: boolean;
  }>(),
  { showInfo: true },
);

const store = useStore();
const env = computed(() => store?.collections.envs.getOne(props.id));

// When this label shows per-environment counts, load that environment's data so
// the counts are accurate. Pure name labels (showInfo=false, e.g. the always
// present env switcher) load nothing, keeping navigation lightweight.
useEnvScope(() => (props.showInfo ? props.id : undefined));

const userCount = computed(
  () =>
    store?.collections.envUserPermissions.all.filter(
      (permission) => permission.env_id == props.id,
    ).length,
);

const deploymentCount = computed(
  () =>
    store?.collections.deployments.all.filter(
      (deployment) =>
        store?.collections.k8sClusters.getOne(deployment.cluster_id)?.env_id ===
        props.id,
    ).length,
);
</script>
