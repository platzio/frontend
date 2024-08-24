import { DbTable } from "@platzio/sdk";
import { createDeploymentsCollection } from "./models/deployment";
import { createDeploymentKindsCollection } from "./models/deployment-kind";
import { createDeploymentTasksCollection } from "./models/deployment-task";
import { createDeploymentPermissionsCollection } from "./models/deployment-permission";
import { createDeploymentResourceTypesCollection } from "./models/deployment-resource-type";
import { createDeploymentResourcesCollection } from "./models/deployment-resource";
import { createEnvsCollection } from "./models/env";
import { createEnvUserPermissionsCollection } from "./models/env-user-permission";
import { createHelmRegistriesCollection } from "./models/helm-registry";
import { createHelmChartsCollection } from "./models/helm-chart";
import { createHelmTagFormatsCollection } from "./models/helm-tag-format";
import { createK8sClustersCollection } from "./models/k8s-cluster";
import { createK8sResourcesCollection } from "./models/k8s-resource";
import { createSecretsCollection } from "./models/secret";
import { createUsersCollection } from "./models/user";

export function createCollections() {
  const users = createUsersCollection();
  const envs = createEnvsCollection();
  const envUserPermissions = createEnvUserPermissionsCollection();
  const secrets = createSecretsCollection();
  const helmRegistries = createHelmRegistriesCollection();
  const helmCharts = createHelmChartsCollection();
  const helmTagFormats = createHelmTagFormatsCollection();
  const k8sClusters = createK8sClustersCollection();
  const k8sResources = createK8sResourcesCollection();
  const deploymentKinds = createDeploymentKindsCollection();
  const deploymentTasks = createDeploymentTasksCollection();
  const deploymentPermissions = createDeploymentPermissionsCollection();
  const deploymentResourceTypes = createDeploymentResourceTypesCollection();
  const deploymentResources = createDeploymentResourcesCollection(
    deploymentResourceTypes
  );
  const deployments = createDeploymentsCollection(
    deploymentKinds,
    helmCharts,
    helmRegistries,
    k8sClusters
  );

  const collections = {
    deployments,
    deploymentKinds,
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
      case DbTable.DeploymentKinds:
        return collections.deploymentKinds;
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
