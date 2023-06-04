import {
    DeploymentResource,
    NewDeploymentResource,
    UpdateDeploymentResource,
} from "@platzio/sdk";
import { createCollection } from "./collection";
import { collection as resourceTypes } from "./deployment-resource-type";

export const collection = createCollection<
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
        const resourceType = resourceTypes.getOne(item.type_id);
        return {
            icon: resourceType && resourceType.spec.fontawesome_icon,
            text: item.name,
        };
    },
});
