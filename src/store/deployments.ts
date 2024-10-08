import {
  type DbTableOrDeploymentResource,
  type Deployment,
} from "@platzio/sdk";
import { useStore } from "./";

export function findCollectionDependencies(
  collection: DbTableOrDeploymentResource,
  id: string
): Deployment[] {
  const store = useStore();
  if (!store) {
    return [];
  }

  const result = [];

  for (const deployment of store.collections.deployments.all) {
    const chart = store?.collections.helmCharts.getOne(
      deployment.helm_chart_id
    );

    if (!chart) {
      continue;
    }

    if (!chart.values_ui) {
      continue;
    }

    for (const input of chart.values_ui.inputs) {
      if (input.collection !== collection) {
        continue;
      }
      if (deployment.config[input.id] === id) {
        result.push(deployment);
      }
    }
  }

  return result;
}
