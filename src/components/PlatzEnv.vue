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
import { useStore } from "@/store";

const props = withDefaults(
  defineProps<{
    id: string;
    showInfo?: boolean;
  }>(),
  { showInfo: true },
);

const store = useStore();
const env = computed(() => store?.collections.envs.getOne(props.id));

const userCount = computed(
  () =>
    store?.collections.envUserPermissions.all.filter(
      (permission) => permission.env_id == props.id,
    ).length,
);

// The deployment count comes straight from the env object (the env endpoints
// return it), kept live by the backend's env refresh events. No per-env
// deployment loading is needed to show counts.
const deploymentCount = computed(() => env.value?.num_deployments ?? 0);
</script>
