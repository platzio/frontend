import {
  type Deployment,
  type NewDeployment,
  type UpdateDeployment,
} from "@platzio/sdk";
import { createCollection } from "./collection";
import { chartIcon, type HelmChartsCollection } from "./helm-chart";
import { type DeploymentKindsCollection } from "./deployment-kind";
import { type HelmRegistriesCollection } from "./helm-registry";
import { type K8sClustersCollection } from "./k8s-cluster";

export const createDeploymentsCollection = (
  deploymentKindsCollection: DeploymentKindsCollection,
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
      const registry = chart
        ? helmRegistriesCollection.getOne(chart.helm_registry_id)
        : undefined;

      let text = item.name;
      if (!text) {
        const kind = deploymentKindsCollection.getOne(item.kind_id);
        text = kind?.name.toLowerCase() || "";
      }

      return {
        inputLabel: true,
        icon: chartIcon(chart) || registry?.fa_icon,
        text,
      };
    },

    envFilter(item, envId) {
      if (!item.enabled) {
        return false;
      }
      const cluster = k8sClustersCollection.getOne(item.cluster_id);
      return cluster?.env_id === envId;
    },
  });
