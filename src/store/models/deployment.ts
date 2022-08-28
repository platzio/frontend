import { CollectionItem, createCollection } from "./collection";
import { DeploymentReportedStatus } from "./deployment-status";
import { collection as k8sClusters } from "./k8s-cluster";
import { chartIcon, collection as helmCharts } from "./helm-chart";

export enum DeploymentStatus {
  Unknown = "Unknown",
  Installing = "Installing",
  Renaming = "Renaming",
  Upgrading = "Upgrading",
  Running = "Running",
  Error = "Error",
  Uninstalling = "Uninstalling",
  Uninstalled = "Uninstalled",
  Deleting = "Deleting",
}

export interface Deployment extends CollectionItem {
  created_at: string;
  name: string;
  kind: string;
  cluster_id: string;
  helm_chart_id: string;
  enabled: boolean;
  status: DeploymentStatus;
  reason: string;
  description_md?: string;
  revision_id?: string;
  config: Record<string, any>;
  values_override: Record<string, any>;
  reported_status?: DeploymentReportedStatus;
}

export interface NewDeployment {
  name: string;
  kind: string;
  helm_chart_id: string;
  config: Record<string, any>;
}

export const collection = createCollection<Deployment>({
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
    return {
      inputLabel: true,
      icon: chartIcon(chart),
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
