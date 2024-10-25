import {
  type DbTableOrDeploymentResource,
  type Deployment,
} from "@platzio/sdk";
import { type Store } from "./";

export function findCollectionDependencies(
  store: Store,
  collection: DbTableOrDeploymentResource,
  id: string
): Deployment[] {
  const result = [];

  for (const deployment of store.collections.deployments.all) {
    const chart = store.collections.helmCharts.getOne(deployment.helm_chart_id);

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
