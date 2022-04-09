import { CollectionItem, createCollection } from './collection'

export interface Env extends CollectionItem {
    created_at: string;
    name: string;
    node_selector: Record<string, string>;
    tolerations: Record<string, string>;
}

export const collection = createCollection<Env>({
    url: '/api/v2/envs',

    sortFunc(x, y) {
        return x.name.localeCompare(y.name)
    },

    formatItem: (item: Env) => ({
        icon: 'city',
        text: item.name,
    })
})
