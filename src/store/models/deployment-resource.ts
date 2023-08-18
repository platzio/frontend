import {
    DeploymentResource,
    NewDeploymentResource,
    UpdateDeploymentResource,
} from "@platzio/sdk";
import { createCollection } from "./collection";
import { DeploymentResourceTypesCollection } from "./deployment-resource-type";

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
                icon: resourceType && resourceType.spec.fontawesome_icon,
                text: item.name,
            };
        },
    });
