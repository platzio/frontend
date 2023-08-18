import { DeploymentPermission, NewDeploymentPermission } from "@platzio/sdk";
import { createCollection } from "./collection";

export const createDeploymentPermissionsCollection = () =>
    createCollection<
        DeploymentPermission,
        NewDeploymentPermission,
        DeploymentPermission,
        void
    >({
        url: "/api/v2/deployment-permissions",

        sortFunc(x, y) {
            return y.created_at.localeCompare(x.created_at);
        },

        formatItem: (item: DeploymentPermission) => ({
            icon: "key",
            text: item.role,
        }),

        envFilter(item, envId) {
            return item.env_id === envId;
        },
    });
