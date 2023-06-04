import { K8sCluster, UpdateK8sCluster } from "@platzio/sdk";
import { createCollection } from "./collection";

export const collection = createCollection<
    K8sCluster,
    void,
    K8sCluster,
    UpdateK8sCluster
>({
    url: "/api/v2/k8s-clusters",

    sortFunc(x, y) {
        if (x.ignore < y.ignore) {
            return -1;
        }
        if (x.ignore > y.ignore) {
            return 1;
        }
        return (
            x.region_name.localeCompare(y.region_name) ||
            x.name.localeCompare(y.name)
        );
    },

    formatItem: (item: K8sCluster) => ({
        icon: "cubes",
        text: item.name,
    }),

    envFilter: (item: K8sCluster, envId) => item.env_id === envId,
});
