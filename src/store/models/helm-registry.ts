import { CollectionItem, createCollection } from './collection';
import { useStore } from '..';

export interface HelmRegistry extends CollectionItem {
    created_at: string;
    domain_name: string;
    repo_name: string;
    kind: string;
    available: boolean;
    category?: string;
    fa_icon: string;
}

export const collection = createCollection<HelmRegistry>({
    url: '/api/v2/helm-registries',

    sortFunc(x, y) {
        return (x.domain_name.localeCompare(y.domain_name) ||
            x.repo_name.localeCompare(y.repo_name));
    },

    formatItem: (item: HelmRegistry) => ({
        icon: 'box',
        text: `${item.domain_name}/${item.repo_name}`,
    })
});

export function allKinds(): string[] {
    const store = useStore();
    return Array.from(
        new Set(store!.collections.helmRegistries.all.map(registry => registry.kind))
    ).sort();
}
