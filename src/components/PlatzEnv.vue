<template>
  <div>
    <div>
      <FaIcon icon="city" fixed-width />
      {{ env?.name }}
    </div>
    <div class="mt-1 small text-body-secondary" v-if="showInfo">
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
import { useStore } from "@/store";

const props = withDefaults(
  defineProps<{
    id: string;
    showInfo?: boolean;
  }>(),
  { showInfo: true }
);

const store = useStore();
const env = computed(() => store?.collections.envs.getOne(props.id));

const userCount = computed(
  () =>
    store?.collections.envUserPermissions.all.filter(
      (permission) => permission.env_id == props.id
    ).length
);

const deploymentCount = computed(
  () =>
    store?.collections.deployments.all.filter(
      (deployment) =>
        store?.collections.k8sClusters.getOne(deployment.cluster_id)?.env_id ===
        props.id
    ).length
);
</script>
