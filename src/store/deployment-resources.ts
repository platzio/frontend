import { computed, reactive } from "vue";
import { useStore } from ".";
import { TableName } from "./collections";
import { DeploymentResource } from "./models/deployment-resource";
import { DbTableOrDeploymentResource, isDeploymentResourceCollection } from "./models/helm-chart";

function toDeploymentResourceCollection(resourceTypeId: string) {
  const store = useStore()

  const resourceType = computed(() => store!.collections.deploymentResourceTypes.getOne(resourceTypeId))

  const all = computed(() => store!.collections.deploymentResources.all.filter(resource => resource.type_id === resourceTypeId))
  const allForEnv = computed(() => (_envId: string) => all.value)
  const formatItem = computed(() => (item: DeploymentResource) => ({
    text: item.name,
    icon: resourceType.value.spec.fontawesome_icon,
  }))

  return reactive({
    all,
    allForEnv,
    formatItem,
  })
}

export function getInputCollection(envId: string, collection: DbTableOrDeploymentResource) {
  const store = useStore()

  // If the collection is an explicit type, find it
  if (isDeploymentResourceCollection(collection)) {
    for (const resourceType of store!.collections.deploymentResourceTypes.all.filter(
      (resourceType) =>
        (resourceType.deployment_kind === collection.deployment) &&
        (resourceType.key === collection.type)
    )) {
      if (
        (resourceType.env_id && resourceType.env_id === envId) ||
        !resourceType.env_id
      ) {
        return toDeploymentResourceCollection(resourceType.id);
      }
    }
  }

  // Otherwise, look for TableName first
  const table = store!.tableNameToCollection(collection as TableName);
  if (table) {
    return table;
  }

  // Then try to find a collection by the collection name itself
  for (const resourceType of store!.collections.deploymentResourceTypes.all.filter(
    (resourceType) => resourceType.key === collection
  )) {
    if (
      (resourceType.env_id && resourceType.env_id === envId) ||
      !resourceType.env_id
    ) {
      return toDeploymentResourceCollection(resourceType.id);
    }
  }

  return null
}
