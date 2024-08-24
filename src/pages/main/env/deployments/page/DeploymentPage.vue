<template>
  <div v-if="deployment">
    <div class="d-flex flex-row justify-content-between align-items-start">
      <div class="d-flex flex-row align-items-center">
        <div class="h1 me-3" v-if="formatted">
          <FaIcon :icon="formatted.icon" />
          {{ formatted.text }}
        </div>
        <PlatzDeploymentStatus class="me-2" :deployment="deployment" />
      </div>

      <DeploymentActions :envId="envId" :deployment="deployment" />
    </div>

    <PlatzReason
      title="Last Deployment Error Log"
      :text="deployment.reason"
      :allow-expand="true"
      :is-bad="hasError"
    />

    <ul class="my-3 lh-sm nav nav-pills">
      <li class="nav-item">
        <router-link
          class="nav-link"
          :to="{ name: 'env.deployments.page' }"
          exact-active-class="active"
        >
          Overview
          <PlatzDeploymentWarnings :deployment="deployment" />
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          class="nav-link"
          :to="{ name: 'env.deployments.page.resources' }"
        >
          Resources
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          class="nav-link"
          :to="{ name: 'env.deployments.page.history' }"
        >
          History
        </router-link>
      </li>
    </ul>

    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { useHead } from "@vueuse/head";
import { useStore } from "@/store";
import PlatzReason from "@/components/base/PlatzReason.vue";
import PlatzDeploymentStatus from "@/components/PlatzDeploymentStatus.vue";
import PlatzDeploymentWarnings from "@/components/PlatzDeploymentWarnings.vue";
import DeploymentActions from "./DeploymentActions.vue";
import { DeploymentStatus } from "@platzio/sdk";

const props = defineProps<{
  envId: string;
  id: string;
  kindId: string;
}>();

const store = useStore();

const env = computed(() => store!.collections.envs.getOne(props.envId));

const deployment = computed(() =>
  store!.collections.deployments.getOne(props.id)
);

const deploymentKind = computed(() =>
  deployment.value
    ? store!.collections.deploymentKinds.getOne(deployment.value.kind_id)
    : undefined
);

const hasError = computed(
  () => deployment.value?.status === DeploymentStatus.Error
);

const formatted = computed(() =>
  deployment.value
    ? store!.collections.deployments.formatItem(deployment.value)
    : undefined
);

onBeforeRouteUpdate((to) => {
  if (to.params.envId !== props.envId) {
    return {
      name: "env.deployments.list",
      params: {
        envId: to.params.envId,
        kindId: props.kindId,
      },
    };
  }
});

useHead({
  title: computed(() =>
    deployment.value?.name
      ? `${deployment.value.name} - ${
          deploymentKind.value?.name || "..."
        } - Deployments - ${env.value?.name || "..."} - Platz`
      : `${deploymentKind.value?.name || "..."} - Deployments - ${
          env.value?.name || "..."
        } - Platz`
  ),
});
</script>
