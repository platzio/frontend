<template>
    <div class="card">
        <div class="card-body row">
            <!-- Overview left part -->
            <div class="col">
                <div v-if="deployment.description_md">
                    <PlatzMarkdown :source="deployment.description_md" />
                </div>
                <div class="text-secondary">
                    <HelmChartWithUpgrade
                        :envId="envId"
                        :deployment="deployment"
                    />
                </div>

                <div class="my-2 text-secondary">
                    <PlatzClusterName :id="deployment.cluster_id" />
                </div>
                <div>
                    <ConfigValues
                        :envId="envId"
                        :uiSchema="chart.values_ui"
                        :config="deployment.config"
                        :valuesOverride="deployment.values_override"
                    />
                </div>
            </div>

            <!-- Overview right part -->
            <div class="col-5" v-if="notices.length > 0 || metrics.length > 0">
                <DeploymentNotices :notices="notices" />

                <div class="row justify-content-end">
                    <div
                        class="col-6 mb-3"
                        v-for="(metric, idx) in metrics"
                        :key="idx"
                    >
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

<script lang="ts">
import { Deployment } from "@platzio/sdk";
import { PropType, computed, defineComponent } from "vue";
import PlatzMetric from "@/components/PlatzMetric.vue";
import PlatzMarkdown from "@/components/PlatzMarkdown.vue";
import PlatzClusterName from "@/components/PlatzClusterName.vue";
import { useStore } from "@/store";
import { deploymentStatusNotices } from "@/store/models/deployment-status";
import ConfigValues from "../config/ConfigValues.vue";
import HelmChartWithUpgrade from "./HelmChartWithUpgrade.vue";
import DeploymentNotices from "./DeploymentNotices.vue";

export default defineComponent({
    components: {
        PlatzMetric,
        PlatzMarkdown,
        PlatzClusterName,
        HelmChartWithUpgrade,
        DeploymentNotices,
        ConfigValues,
    },

    props: {
        envId: {
            type: String,
            required: true,
        },
        deployment: {
            type: Object as PropType<Deployment>,
            required: true,
        },
    },

    setup(props) {
        const store = useStore();

        const chart = computed(() =>
            store!.collections.helmCharts.getOne(props.deployment.helm_chart_id)
        );

        const notices = computed(() =>
            deploymentStatusNotices(props.deployment)
        );

        const metrics = computed(() => {
            const { reported_status } = props.deployment;
            return reported_status && reported_status.content
                ? (reported_status.content.metrics || []).concat(
                      reported_status.content.primary_metric
                          ? [reported_status.content.primary_metric]
                          : []
                  )
                : [];
        });

        return {
            chart,
            notices,
            metrics,
        };
    },
});
</script>
