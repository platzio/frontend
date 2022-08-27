<template>
  <div class="d-flex flex-row justify-content-between align-items-center">
    <div>
      <div class="my-1">
        <PlatzDeploymentStatus class="me-2" :deployment="deployment" />
        <span v-if="formatted">
          <FaIcon :icon="formatted.icon" />
          {{ formatted.text }}
        </span>
        <PlatzDeploymentWarnings :deployment="deployment" />
      </div>

      <PlatzReason
        class="mt-1"
        :text="deployment.reason"
        :allow-expand="false"
        :is-bad="hasError"
      />

      <div class="my-2 small opacity-75 d-flex flex-row align-items-center">
        <PlatzClusterName :id="deployment.cluster_id" />
        <FaIcon icon="angle-right" class="ms-2 me-1 opacity-75" />
        <PlatzResourceStatus
          :id="resource.id"
          v-for="resource in k8sResources"
          :key="resource.id"
          class="ms-1"
        />
      </div>

      <div class="my-1 small d-flex flex-row align-items-center">
        <div
          class="me-2 badge rounded-pill bg-primary fw-normal"
          style="font-size: 0.8rem"
          v-if="isMaintainer && hasUpgrade"
        >
          <FaIcon icon="arrow-circle-up" fixed-width />
        </div>
        <div class="text-secondary">
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

    <PlatzMetric v-if="primaryMetric" :metric="primaryMetric" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { useStore } from "@/store";
import { Deployment, DeploymentStatus } from "@/store/models/deployment";
import { chartForUpgrade } from "@/store/models/helm-chart";
import { isDeploymentMaintainer } from "@/store/permissions";
import PlatzMetric from "./PlatzMetric.vue";

export default defineComponent({
  props: {
    deployment: {
      type: Object as PropType<Deployment>,
      required: true,
    },
  },

  components: {
    PlatzMetric,
  },

  setup(props) {
    const store = useStore();

    const hasError = computed(() => props.deployment.status == DeploymentStatus.Error);

    const formatted = computed(() => store!.collections.deployments.formatItem(props.deployment));

    const chart = computed(() =>
      store!.collections.helmCharts.getOne(props.deployment.helm_chart_id)
    );

    const hasUpgrade = computed(
      () => props.deployment.enabled && (chart.value ? chartForUpgrade(chart.value) : null)
    );

    const isMaintainer = computed(() => {
      const envId = store!.collections.k8sClusters.getOne(props.deployment.cluster_id).env_id;
      return envId && isDeploymentMaintainer(envId, props.deployment.kind);
    });

    const primaryMetric = computed(
      () =>
        props.deployment.reported_status &&
        props.deployment.reported_status.content &&
        props.deployment.reported_status.content.status &&
        props.deployment.reported_status.content.primary_metric
    );

    const k8sResources = computed(() =>
      store!.collections.k8sResources.all
        .filter((resource) => resource.deployment_id == props.deployment.id)
        .filter((resource) => resource.kind != "Job")
    );

    return {
      hasError,
      formatted,
      chart,
      hasUpgrade,
      isMaintainer,
      primaryMetric,
      k8sResources,
    };
  },
});
</script>
