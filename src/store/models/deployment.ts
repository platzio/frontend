import { Deployment, NewDeployment, UpdateDeployment } from "@platzio/sdk";
import { createCollection } from "./collection";
import { collection as k8sClusters } from "./k8s-cluster";
import { collection as helmRegistries } from "./helm-registry";
import { chartIcon, collection as helmCharts } from "./helm-chart";

export const collection = createCollection<
    Deployment,
    NewDeployment,
    Deployment,
    UpdateDeployment
>({
    url: "/api/v2/deployments",

    sortFunc(x: Deployment, y: Deployment) {
        if (x.enabled < y.enabled) {
            return 1;
        }
        if (x.enabled > y.enabled) {
            return -1;
        }
        return x.name.localeCompare(y.name);
    },

    formatItem: (item: Deployment) => {
        const chart = helmCharts.getOne(item.helm_chart_id);
        const registry = helmRegistries.getOne(chart.helm_registry_id);
        return {
            inputLabel: true,
            icon: chartIcon(chart) || registry.fa_icon,
            text: item.name || item.kind.toLowerCase(),
        };
    },

    envFilter(item, envId) {
        if (!item.enabled) {
            return false;
        }
        const cluster = k8sClusters.getOne(item.cluster_id);
        return cluster && cluster.env_id === envId;
    },
});
