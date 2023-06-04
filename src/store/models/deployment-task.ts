import { CreateDeploymentTask, DeploymentTask } from "@platzio/sdk";
import { createCollection } from "./collection";

export const collection = createCollection<
    DeploymentTask,
    CreateDeploymentTask,
    DeploymentTask,
    void
>({
    url: "/api/v2/deployment-tasks",

    sortFunc(x, y) {
        return y.created_at.localeCompare(x.created_at);
    },

    formatItem: (item: DeploymentTask) => ({
        icon: "tasks",
        text: Object.keys(item.operation)[0],
    }),

    initialFilters: {
        deployment_id: "123e4567-e89b-12d3-a456-426614174000",
    },
});
