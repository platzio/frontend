<template>
  <div v-if="deployment" class="card">
    <div class="card-body row">
      <!-- Overview left part -->
      <div class="col">
        <div v-if="deployment.description_md">
          <PlatzMarkdown :source="deployment.description_md" />
        </div>
        <div class="text-secondary">
          <HelmChartWithUpgrade :env-id="envId" :deployment="deployment" />
        </div>

        <div class="my-2 text-secondary">
          <PlatzClusterName :id="deployment.cluster_id" />
        </div>
        <div v-if="chart">
          <ConfigValues
            :env-id="envId"
            :ui-schema="chart.values_ui"
            :config="deployment.config"
            :values-override="deployment.values_override"
          />
        </div>
      </div>

      <!-- Overview right part -->
      <div v-if="notices.length > 0 || metrics.length > 0" class="col-5">
        <DeploymentNotices :notices="notices" />

        <div class="row justify-content-end">
          <div v-for="(metric, idx) in metrics" :key="idx" class="col-6 mb-3">
            <div class="card">
              <div class="card-body px-4 py-3">
                <PlatzMetric :metric="metric" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PlatzMetric from "@/components/PlatzMetric.vue";
import PlatzMarkdown from "@/components/PlatzMarkdown.vue";
import PlatzClusterName from "@/components/PlatzClusterName.vue";
import { useStore } from "@/store";
import { deploymentStatusNotices } from "@/store/models/deployment-status";
import ConfigValues from "../config/ConfigValues.vue";
import HelmChartWithUpgrade from "./HelmChartWithUpgrade.vue";
import DeploymentNotices from "./DeploymentNotices.vue";

const props = defineProps<{
  envId: string;
  id: string;
}>();

const store = useStore();

const deployment = computed(() =>
  store?.collections.deployments.getOne(props.id)
);

const chart = computed(() =>
  deployment.value
    ? store?.collections.helmCharts.getOne(deployment.value.helm_chart_id)
    : undefined
);

const notices = computed(() =>
  deployment.value ? deploymentStatusNotices(deployment.value) : []
);

const metrics = computed(() => {
  if (!deployment.value?.reported_status?.content) {
    return [];
  }
  const { content } = deployment.value.reported_status;
  return content
    ? (content.metrics || []).concat(
        content.primary_metric ? [content.primary_metric] : []
      )
    : [];
});
</script>
