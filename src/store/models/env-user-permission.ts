import {
  type EnvUserPermission,
  type NewEnvUserPermission,
} from "@platzio/sdk";
import { createCollection } from "./collection";

export const createEnvUserPermissionsCollection = () =>
  createCollection<
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
      inputLabel: false,
      icon: "key",
      text: item.role,
    }),

    envFilter(item, envId) {
      return item.env_id === envId;
    },
  });
