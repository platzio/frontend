import {
  type DeploymentResource,
  type NewDeploymentResource,
  type UpdateDeploymentResource,
} from "@platzio/sdk";
import { createCollection } from "./collection";
import { type DeploymentResourceTypesCollection } from "./deployment-resource-type";

export const createDeploymentResourcesCollection = (
  deploymentResourceTypesCollection: DeploymentResourceTypesCollection
) =>
  createCollection<
    DeploymentResource,
    NewDeploymentResource,
    DeploymentResource,
    UpdateDeploymentResource
  >({
    url: "/api/v2/deployment-resources",

    sortFunc(x, y) {
      return x.name.localeCompare(y.name);
    },

    formatItem: (item: DeploymentResource) => {
      const resourceType = deploymentResourceTypesCollection.getOne(
        item.type_id
      );
      return {
        inputLabel: false,
        icon: resourceType?.spec.fontawesome_icon,
        text: item.name,
      };
    },
  });
