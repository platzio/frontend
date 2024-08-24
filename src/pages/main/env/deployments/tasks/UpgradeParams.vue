<template>
  <div v-if="newChart">
    <div v-if="oldChart" class="mt-1 mb-2 d-flex flex-row align-items-center">
      <PlatzHelmChart
        :chart="oldChart"
        :color="false"
        format="git"
        :time="false"
        :digest="false"
        size="sm"
      />
      <div class="mx-2 small opacity50">
        <FaIcon icon="arrow-right" fixed-width />
      </div>
      <PlatzHelmChart
        :chart="newChart"
        :color="false"
        format="git"
        :time="false"
        :digest="false"
        size="sm"
      />
    </div>
    <div v-if="configDelta && newChart.values_ui" class="mb-2">
      <ConfigDelta
        :uiSchema="newChart.values_ui"
        :delta="configDelta"
        :envId="envId"
        :allValues="operation.config_inputs"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { type DeploymentUpgradeTask } from "@platzio/sdk";
import PlatzHelmChart from "@/components/PlatzHelmChart.vue";
import ConfigDelta from "./ConfigDelta.vue";
import {
  type HelmChartsCollection,
  InjectedHelmChartsCollection,
} from "@/store/models/helm-chart";

const props = defineProps<{
  envId: string;
  operation: DeploymentUpgradeTask;
}>();

const helmChartsCollection = inject<HelmChartsCollection>(
  InjectedHelmChartsCollection
);

const oldChartId = computed(() =>
  props.operation.prev_helm_chart_id &&
  props.operation.prev_helm_chart_id !== props.operation.helm_chart_id
    ? props.operation.prev_helm_chart_id
    : null
);

const oldChart = computed(() =>
  oldChartId.value ? helmChartsCollection!.getOne(oldChartId.value) : null
);

const newChart = computed(() =>
  helmChartsCollection!.getOne(props.operation.helm_chart_id)
);

const configDelta = computed(() => props.operation.config_delta);
</script>
