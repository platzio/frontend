import { type Env, type NewEnv, type UpdateEnv } from "@platzio/sdk";
import { createCollection } from "./collection";

// The env endpoints return each env with its live deployment count
// (num_deployments), kept current by an `envs` refresh event the backend emits
// whenever a deployment change affects a count. The SDK's generated `Env` type
// doesn't include it yet, so extend it here until the SDK is regenerated.
export type EnvWithStats = Env & { num_deployments: number };

export const createEnvsCollection = () =>
  createCollection<EnvWithStats, NewEnv, Env, UpdateEnv>({
    url: "/api/v2/envs",

    sortFunc(x, y) {
      return x.name.localeCompare(y.name);
    },

    formatItem: (item) => ({
      inputLabel: false,
      icon: "city",
      text: item.name,
    }),
  });
