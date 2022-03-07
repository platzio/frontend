<template>
  <div>
    <div>
      <fa icon="city" fixed-width />
      {{ env.name }}
    </div>
    <div class="mt-1 small text-muted" v-if="showInfo">
      {{ userCount === 1 ? "1 user" : `${userCount} users` }},
      {{
        deploymentCount === 1
          ? "1 deployment"
          : `${deploymentCount} deployments`
      }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "@/store";

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    showInfo: {
      type: Boolean,
      default: true,
    },
  },

  setup(props) {
    const store = useStore();
    const env = computed(() => store!.collections.envs.getOne(props.id));

    const userCount = computed(
      () =>
        store!.collections.envUserPermissions.all.filter(
          (permission) => permission.env_id == props.id
        ).length
    );

    const deploymentCount = computed(
      () =>
        store!.collections.deployments.all.filter(
          (deployment) =>
            store!.collections.k8sClusters.getOne(deployment.cluster_id)
              .env_id == props.id
        ).length
    );

    return {
      env,
      userCount,
      deploymentCount,
    };
  },
});
</script>
