import { Deployment } from './models/deployment'
import { TableName } from './collections'
import { useStore } from './'

export interface DeploymentResourceCollection {
    deployment: string;
    type: string;
}

export type LegacyCollectionName = string;

export type DbTableOrDeploymentResource = TableName | DeploymentResourceCollection | LegacyCollectionName;

export function findCollectionDependencies(
    collection: DbTableOrDeploymentResource,
    id: string,
): Deployment[] {
    const store = useStore()
    const result = []

    for (const deployment of store!.collections.deployments.all) {
        const chart = store!.collections.helmCharts.getOne(
            deployment.helm_chart_id)
        if (!chart.values_ui) {
            continue
        }

        for (const input of chart.values_ui.inputs) {
            if (input.collection !== collection) {
                continue
            }
            if (deployment.config[input.id] === id) {
                result.push(deployment)
            }
        }
    }

    return result
}