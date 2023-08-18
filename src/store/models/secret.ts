import { NewSecret, Secret, UpdateSecretApi } from "@platzio/sdk";
import { createCollection } from "./collection";

export const createSecretsCollection = () =>
    createCollection<Secret, NewSecret, Secret, UpdateSecretApi>({
        url: "/api/v2/secrets",

        sortFunc(x, y) {
            return (
                x.collection.localeCompare(y.collection) ||
                x.name.localeCompare(y.name)
            );
        },

        formatItem: (item: Secret) => {
            let icon = "key";
            switch (item.collection) {
                case "PagerDuty Services":
                    icon = "ambulance";
                    break;
            }
            return {
                inputLabel: true,
                icon,
                text: item.name,
            };
        },

        envFilter: (item: Secret, envId) => item.env_id === envId,
    });
