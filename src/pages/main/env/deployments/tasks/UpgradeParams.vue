<template>
    <div>
        <div
            v-if="oldChart"
            class="mt-1 mb-2 d-flex flex-row align-items-center"
        >
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
                :delta="configDelta"
                :envId="envId"
                :allValues="operation.config_inputs"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, PropType } from "vue";
import { DeploymentUpgradeTask } from "@platzio/sdk";
import PlatzHelmChart from "@/components/PlatzHelmChart.vue";
import ConfigDelta from "./ConfigDelta.vue";
import {
    HelmChartsCollection,
    InjectedHelmChartsCollection,
} from "@/store/models/helm-chart";

export default defineComponent({
    components: {
        PlatzHelmChart,
        ConfigDelta,
    },

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

    setup(props) {
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
            oldChartId.value
                ? helmChartsCollection!.getOne(oldChartId.value)
                : null
        );

        const newChart = computed(() =>
            helmChartsCollection!.getOne(props.operation.helm_chart_id)
        );

        const configDelta = computed(() => props.operation.config_delta);

        return {
            oldChart,
            newChart,
            configDelta,
        };
    },
});
</script>
