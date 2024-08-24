import { type Env, type NewEnv, type UpdateEnv } from "@platzio/sdk";
import { createCollection } from "./collection";

export const createEnvsCollection = () =>
  createCollection<Env, NewEnv, Env, UpdateEnv>({
    url: "/api/v2/envs",

    sortFunc(x, y) {
      return x.name.localeCompare(y.name);
    },

    formatItem: (item: Env) => ({
      inputLabel: false,
      icon: "city",
      text: item.name,
    }),
  });
