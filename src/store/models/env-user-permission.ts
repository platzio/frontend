import { EnvUserPermission, NewEnvUserPermission } from "@platzio/sdk";
import { createCollection } from "./collection";

export const collection = createCollection<
    EnvUserPermission,
    NewEnvUserPermission,
    EnvUserPermission,
    void
>({
    url: "/api/v2/env-user-permissions",

    sortFunc(x, y) {
        return x.created_at.localeCompare(y.created_at);
    },

    formatItem: (item: EnvUserPermission) => ({
        icon: "key",
        text: item.role,
    }),

    envFilter(item, envId) {
        return item.env_id === envId;
    },
});
