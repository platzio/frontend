import { K8sResource } from "@platzio/sdk";
import { createCollection } from "./collection";

export const collection = createCollection<
    K8sResource,
    void,
    K8sResource,
    void
>({
    url: "/api/v2/k8s-resources",

    sortFunc(x, y) {
        return x.name.localeCompare(y.name);
    },

    formatItem: (item: K8sResource) => ({
        icon: "cubes",
        text: item.name,
    }),
});
