import { Deployment, NewDeployment, UpdateDeployment } from "@platzio/sdk";
import { createCollection } from "./collection";
import { HelmChartsCollection, chartIcon } from "./helm-chart";
import { HelmRegistriesCollection } from "./helm-registry";
import { K8sClustersCollection } from "./k8s-cluster";

export const createDeploymentsCollection = (
    helmChartsCollection: HelmChartsCollection,
    helmRegistriesCollection: HelmRegistriesCollection,
    k8sClustersCollection: K8sClustersCollection
) =>
    createCollection<Deployment, NewDeployment, Deployment, UpdateDeployment>({
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
            const chart = helmChartsCollection.getOne(item.helm_chart_id);
            const registry = helmRegistriesCollection.getOne(
                chart.helm_registry_id
            );
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
            const cluster = k8sClustersCollection.getOne(item.cluster_id);
            return cluster && cluster.env_id === envId;
        },
    });
