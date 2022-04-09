import { CollectionItem, createCollection } from './collection'

export interface K8sCluster extends CollectionItem {
    created_at: string;
    last_seen_at: string;
    name: string;
    env_id?: string;
    region_name: string;
    is_ok: boolean;
    not_ok_reason: string;
    ignore: boolean;
    domain?: string;
    grafana_url?: string;
}

export const collection = createCollection<K8sCluster>({
    url: '/api/v2/k8s-clusters',

    sortFunc(x, y) {
        if (x.ignore < y.ignore) {
            return -1
        }
        if (x.ignore > y.ignore) {
            return 1
        }
        return x.region_name.localeCompare(y.region_name) ||
            x.name.localeCompare(y.name)
    },

    formatItem: (item: K8sCluster) => ({
        icon: 'cubes',
        text: item.name,
    }),

    envFilter: (item: K8sCluster, envId) => item.env_id === envId,
})
