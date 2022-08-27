<template>
  <div>
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
    <div v-if="operation.config_delta && newChart.values_ui" class="mb-2">
      <ConfigDelta
        :uiSchema="newChart.values_ui"
        :delta="operation.config_delta"
        :envId="envId"
        :allValues="operation.config_inputs"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { DeploymentUpgradeTask } from "@/store/models/deployment-task";
import { useStore } from "@/store";
import ConfigDelta from "./ConfigDelta.vue";

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
    operation: {
      type: Object as PropType<DeploymentUpgradeTask>,
      required: true,
    },
  },

  components: {
    ConfigDelta,
  },

  setup(props) {
    const store = useStore();

    const oldChartId = computed(() =>
      props.operation.prev_helm_chart_id &&
      props.operation.prev_helm_chart_id !== props.operation.helm_chart_id
        ? props.operation.prev_helm_chart_id
        : null
    );

    const oldChart = computed(() =>
      oldChartId.value ? store!.collections.helmCharts.getOne(oldChartId.value) : null
    );

    const newChart = computed(() =>
      store!.collections.helmCharts.getOne(props.operation.helm_chart_id)
    );

    return {
      oldChart,
      newChart,
    };
  },
});
</script>
