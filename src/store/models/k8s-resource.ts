import { CollectionItem, createCollection } from './collection'

export type K8sResourceKind = 'Deployment' | 'StatefulSet' | 'Job';

export interface K8sResource extends CollectionItem {
    deployment_id: string;
    kind: K8sResourceKind;
    api_version: string;
    name: string;
    status_color: string[];
    metadata: Record<string, any>;
}

export const collection = createCollection<K8sResource>({
    url: '/api/v1/k8s-resources',

    sortFunc(x, y) {
        return x.name.localeCompare(y.name)
    },

    formatItem: (item: K8sResource) => ({
        icon: 'cubes',
        text: item.name,
    }),
})
