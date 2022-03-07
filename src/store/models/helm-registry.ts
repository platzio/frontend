import { CollectionItem, createCollection } from './collection'
import { capitalize } from 'lodash'
import { useStore } from '..'

export interface HelmRegistry extends CollectionItem {
    created_at: string;
    domain_name: string;
    repo_name: string;
    available: boolean;
    category?: string;
    fa_icon: string;
}

export const collection = createCollection<HelmRegistry>({
    url: '/api/v1/helm-registries',

    sortFunc(x, y) {
        return (x.domain_name.localeCompare(y.domain_name) ||
            x.repo_name.localeCompare(y.repo_name))
    },

    formatItem: (item: HelmRegistry) => ({
        icon: 'box',
        text: `${item.domain_name}/${item.repo_name}`,
    })
})

export function getKind(registry: HelmRegistry): string {
    return registry.repo_name.split("-").map(capitalize).join("")
}

export function allKinds(): string[] {
    const store = useStore();
    return store!.collections.helmRegistries.all.map(getKind).sort()
}