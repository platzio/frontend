import { CollectionItem, createCollection } from './collection'

export interface HelmTagFormat extends CollectionItem {
    created_at: string;
    pattern: string;
}

export const collection = createCollection<HelmTagFormat>({
    url: '/api/v2/helm-tag-format',

    sortFunc(x, y) {
        return x.created_at.localeCompare(y.created_at)
    },

    formatItem: (item: HelmTagFormat) => ({
        icon: 'tag',
        text: item.pattern,
    }),
})
