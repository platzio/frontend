import {
  type DeploymentResourceType,
  type NewDeploymentResource,
  type UpdateDeploymentResource,
} from "@platzio/sdk";
import { createCollection } from "./collection";

export type DeploymentResourceTypesCollection = ReturnType<
  typeof createCollection<
    DeploymentResourceType,
    NewDeploymentResource,
    DeploymentResourceType,
    UpdateDeploymentResource
  >
>;

export const createDeploymentResourceTypesCollection = () =>
  createCollection<
    DeploymentResourceType,
    NewDeploymentResource,
    DeploymentResourceType,
    UpdateDeploymentResource
  >({
    url: "/api/v2/deployment-resource-types",

    sortFunc(x, y) {
      return x.spec.name_singular.localeCompare(y.spec.name_singular);
    },

    formatItem: (item: DeploymentResourceType) => ({
      inputLabel: false,
      icon: "city",
      text: item.spec.name_singular,
    }),
  });
