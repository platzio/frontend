import { DbTable } from "@platzio/sdk";
import { collection as deployments } from "./models/deployment";
import { collection as deploymentTasks } from "./models/deployment-task";
import { collection as deploymentPermissions } from "./models/deployment-permission";
import { collection as deploymentResourceTypes } from "./models/deployment-resource-type";
import { collection as deploymentResources } from "./models/deployment-resource";
import { collection as helmRegistries } from "./models/helm-registry";
import { collection as helmCharts } from "./models/helm-chart";
import { collection as helmTagFormats } from "./models/helm-tag-format";
import { collection as k8sClusters } from "./models/k8s-cluster";
import { collection as k8sResources } from "./models/k8s-resource";
import { collection as secrets } from "./models/secret";
import { collection as envs } from "./models/env";
import { collection as envUserPermissions } from "./models/env-user-permission";
import { collection as users } from "./models/user";

export function createCollections() {
    const collections = {
        deployments,
        deploymentTasks,
        deploymentPermissions,
        deploymentResourceTypes,
        deploymentResources,
        envs,
        envUserPermissions,
        helmRegistries,
        helmCharts,
        helmTagFormats,
        k8sClusters,
        k8sResources,
        secrets,
        users,
    };

    function dbTableToCollection(table_name: DbTable) {
        switch (table_name) {
            case DbTable.Deployments:
                return collections.deployments;
            case DbTable.DeploymentTasks:
                return collections.deploymentTasks;
            case DbTable.DeploymentPermissions:
                return collections.deploymentPermissions;
            case DbTable.DeploymentResourceTypes:
                return collections.deploymentResourceTypes;
            case DbTable.DeploymentResources:
                return collections.deploymentResources;
            case DbTable.Envs:
                return collections.envs;
            case DbTable.EnvUserPermissions:
                return collections.envUserPermissions;
            case DbTable.HelmRegistries:
                return collections.helmRegistries;
            case DbTable.HelmCharts:
                return collections.helmCharts;
            case DbTable.HelmTagFormats:
                return collections.helmTagFormats;
            case DbTable.K8sClusters:
                return collections.k8sClusters;
            case DbTable.K8sResources:
                return collections.k8sResources;
            case DbTable.Secrets:
                return collections.secrets;
            case DbTable.Users:
                return collections.users;
        }
    }

    return {
        collections,
        dbTableToCollection,
    };
}
