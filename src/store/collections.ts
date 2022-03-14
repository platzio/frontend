import { collection as deployments } from './models/deployment'
import { collection as deploymentTasks } from './models/deployment-task'
import { collection as deploymentPermissions } from './models/deployment-permission'
import { collection as deploymentResourceTypes } from './models/deployment-resource-type'
import { collection as deploymentResources } from './models/deployment-resource'
import { collection as helmRegistries } from './models/helm-registry'
import { collection as helmCharts } from './models/helm-chart'
import { collection as k8sClusters } from './models/k8s-cluster'
import { collection as k8sResources } from './models/k8s-resource'
import { collection as secrets } from './models/secret'
import { collection as envs } from './models/env'
import { collection as envUserPermissions } from './models/env-user-permission'
import { collection as users } from './models/user'

export type TableName =
    'deployments' |
    'deployment_tasks' |
    'deployment_permissions' |
    'deployment_resource_types' |
    'deployment_resources' |
    'helm_registries' |
    'helm_charts' |
    'k8s_clusters' |
    'k8s_resources' |
    'secrets' |
    'envs' |
    'env_user_permissions' |
    'users';

export function createCollections() {
    const collections = {
        deployments,
        deploymentTasks,
        deploymentPermissions,
        deploymentResourceTypes,
        deploymentResources,
        helmRegistries,
        helmCharts,
        k8sClusters,
        k8sResources,
        secrets,
        envs,
        envUserPermissions,
        users,
    }

    function tableNameToCollection(table_name: TableName) {
        switch (table_name) {
            case 'deployments':
                return collections.deployments
            case 'deployment_tasks':
                return collections.deploymentTasks
            case 'deployment_permissions':
                return collections.deploymentPermissions
            case 'deployment_resource_types':
                return collections.deploymentResourceTypes
            case 'deployment_resources':
                return collections.deploymentResources
            case 'helm_registries':
                return collections.helmRegistries
            case 'helm_charts':
                return collections.helmCharts
            case 'k8s_clusters':
                return collections.k8sClusters
            case 'k8s_resources':
                return collections.k8sResources
            case 'secrets':
                return collections.secrets
            case 'envs':
                return collections.envs
            case 'env_user_permissions':
                return collections.envUserPermissions
            case 'users':
                return collections.users
        }
    }

    return {
        collections,
        tableNameToCollection,
    }
}
