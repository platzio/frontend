import { Env, NewEnv, UpdateEnv } from "@platzio/sdk";
import { createCollection } from "./collection";

export const createEnvsCollection = () =>
    createCollection<Env, NewEnv, Env, UpdateEnv>({
        url: "/api/v2/envs",

        sortFunc(x, y) {
            return x.name.localeCompare(y.name);
        },

        formatItem: (item: Env) => ({
            icon: "city",
            text: item.name,
        }),
    });
