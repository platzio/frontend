import { computed, reactive } from "vue";
import { type Store } from ".";
import { DbTable, type DbTableOrDeploymentResource } from "@platzio/sdk";

function toDeploymentResourceCollection(store: Store, resourceTypeId: string) {
  const resourceType = computed(() =>
    store.collections.deploymentResourceTypes.getOne(resourceTypeId)
  );

  const all = computed(() =>
    store.collections.deploymentResources.all.filter(
      (resource) => resource.type_id === resourceTypeId
    )
  );
  const allForEnv = computed(() => () => all.value);
  const getOne = computed(
    () => (id: string) => store.collections.deploymentResources.getOne(id)
  );
  const formatItem = computed(() => (item: any) => ({
    text: item.name,
    icon: resourceType.value?.spec.fontawesome_icon,
    inputLabel: "",
    label: "",
  }));

  return reactive({
    all,
    allForEnv,
    getOne,
    formatItem,
  });
}

export function getInputCollection(
  store: Store,
  envId: string,
  collection: DbTableOrDeploymentResource
) {
  // If the collection is an explicit type, find it
  if (typeof collection !== "string" && "deployment" in collection) {
    for (const resourceType of store.collections.deploymentResourceTypes.all.filter(
      (resourceType) =>
        store.collections.deploymentKinds.getOne(
          resourceType.deployment_kind_id
        )?.name === collection.deployment &&
        resourceType.key === collection.type
    )) {
      if (
        (resourceType.env_id && resourceType.env_id === envId) ||
        !resourceType.env_id
      ) {
        return toDeploymentResourceCollection(store, resourceType.id);
      }
    }
  }

  // Otherwise, look for DbTable first
  const table = store.dbTableToCollection(collection as DbTable);
  if (table) {
    return table;
  }

  // Then try to find a collection by the collection name itself
  for (const resourceType of store.collections.deploymentResourceTypes.all.filter(
    (resourceType) => resourceType.key === collection
  )) {
    if (
      (resourceType.env_id && resourceType.env_id === envId) ||
      !resourceType.env_id
    ) {
      return toDeploymentResourceCollection(store, resourceType.id);
    }
  }

  return null;
}
