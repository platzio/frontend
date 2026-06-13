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
import { createBotsCollection } from "./models/bot";

export function createCollections() {
  const users = createUsersCollection();
  const bots = createBotsCollection();
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
    bots,
  };

  function dbTableToCollection(table_name: DbTable) {
    switch (table_name) {
      case DbTable.Bots:
        return collections.bots;
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

  // Global (non-environment-scoped) collections. Loaded once and kept live for
  // the whole session; their subscription carries no env_id.
  const catalog = [
    { table: DbTable.Envs, collection: envs },
    { table: DbTable.Users, collection: users },
    { table: DbTable.Bots, collection: bots },
    { table: DbTable.K8sClusters, collection: k8sClusters },
    { table: DbTable.K8sResources, collection: k8sResources },
    { table: DbTable.DeploymentKinds, collection: deploymentKinds },
    {
      table: DbTable.DeploymentResourceTypes,
      collection: deploymentResourceTypes,
    },
    { table: DbTable.HelmRegistries, collection: helmRegistries },
    { table: DbTable.HelmCharts, collection: helmCharts },
    { table: DbTable.HelmTagFormats, collection: helmTagFormats },
    // The user's environment memberships are needed across all environments
    // (e.g. the env switcher lists every env the user belongs to), and are
    // already bounded to the user's environments by the API's permission
    // scope, so they are loaded globally rather than per environment.
    { table: DbTable.EnvUserPermissions, collection: envUserPermissions },
  ];

  // Environment-scoped collections. Loaded and subscribed per environment, on
  // demand, by the views that show that environment.
  const envScoped = [
    { table: DbTable.Deployments, collection: deployments },
    { table: DbTable.DeploymentTasks, collection: deploymentTasks },
    { table: DbTable.DeploymentResources, collection: deploymentResources },
    { table: DbTable.Secrets, collection: secrets },
    { table: DbTable.DeploymentPermissions, collection: deploymentPermissions },
  ];

  return {
    collections,
    dbTableToCollection,
    catalog,
    envScoped,
  };
}
