<template>
  <div class="d-flex flex-row justify-content-between align-items-center">
    <div class="flex-fill">
      <div class="my-1 d-flex flex-row align-items-baseline">
        <PlatzDeploymentStatus class="me-2" :deployment="deployment" />
        <template v-if="formatted">
          <span class="ms-1" style="white-space: nowrap">
            <FaIcon :icon="formatted.icon" />
            {{ formatted.text }}
          </span>
        </template>
        <PlatzDeploymentWarnings :deployment="deployment" />
        <PlatzReason
          class="ms-3"
          :text="deployment.reason"
          :is-bad="hasError"
        />
      </div>

      <div class="my-2 small opacity-75 d-flex flex-row align-items-center">
        <PlatzClusterName :id="deployment.cluster_id" />
        <FaIcon icon="angle-right" class="ms-2 me-1 opacity-75" />
        <PlatzResourceStatus
          v-for="resource in k8sResources"
          :id="resource.id"
          :key="resource.id"
          class="ms-1"
        />
      </div>

      <div class="my-1 small d-flex flex-row align-items-center">
        <div
          v-if="isMaintainer && hasUpgrade"
          class="me-2 badge rounded-pill bg-primary fw-normal"
          style="font-size: 0.8rem"
        >
          <FaIcon icon="arrow-circle-up" fixed-width />
        </div>
        <div v-if="chart" class="text-secondary">
          <PlatzHelmChart
            :chart="chart"
            :color="false"
            format="git"
            :time="false"
            :digest="false"
          />
        </div>
      </div>
    </div>

    <PlatzMetric v-if="primaryMetric" class="ms-2" :metric="primaryMetric" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type Deployment, DeploymentStatus } from "@platzio/sdk";
import { useStore } from "@/store";
import PlatzReason from "./base/PlatzReason.vue";
import PlatzDeploymentStatus from "./PlatzDeploymentStatus.vue";
import PlatzDeploymentWarnings from "./PlatzDeploymentWarnings.vue";
import PlatzResourceStatus from "./PlatzResourceStatus.vue";
import PlatzClusterName from "./PlatzClusterName.vue";
import PlatzHelmChart from "./PlatzHelmChart.vue";
import { chartForUpgrade } from "@/store/models/helm-chart";
import { isDeploymentMaintainer } from "@/store/permissions";
import PlatzMetric from "./PlatzMetric.vue";

const props = defineProps<{
  deployment: Deployment;
}>();

const store = useStore();

const hasError = computed(
  () => props.deployment.status == DeploymentStatus.Error
);

const formatted = computed(() =>
  store?.collections.deployments.formatItem(props.deployment)
);

const chart = computed(() =>
  store?.collections.helmCharts.getOne(props.deployment.helm_chart_id)
);

const hasUpgrade = computed(
  () =>
    props.deployment.enabled &&
    (chart.value ? chartForUpgrade(chart.value) : null)
);

const isMaintainer = computed(() => {
  const envId = store?.collections.k8sClusters.getOne(
    props.deployment.cluster_id
  )?.env_id;
  return envId && isDeploymentMaintainer(envId, props.deployment.kind_id);
});

const primaryMetric = computed(
  () =>
    props.deployment.reported_status?.content?.status &&
    props.deployment.reported_status.content.primary_metric
);

const k8sResources = computed(() =>
  store?.collections.k8sResources.all
    .filter((resource) => resource.deployment_id == props.deployment.id)
    .filter((resource) => resource.kind != "Job")
);
</script>
