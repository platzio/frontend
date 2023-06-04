import {
    DeploymentResourceType,
    NewDeploymentResource,
    UpdateDeploymentResource,
} from "@platzio/sdk";
import { createCollection } from "./collection";

export const collection = createCollection<
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
        icon: "city",
        text: item.spec.name_singular,
    }),
});
