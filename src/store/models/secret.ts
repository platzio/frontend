import { CollectionItem, createCollection } from './collection'

export interface Secret extends CollectionItem {
    created_at: string;
    updated_at: string;
    env_id: string;
    collection: string;
    name: string;
}

export const collection = createCollection<Secret>({
    url: '/api/v1/secrets',

    sortFunc(x, y) {
        return x.collection.localeCompare(y.collection) ||
            x.name.localeCompare(y.name)
    },

    formatItem: (item: Secret) => {
        let icon = 'key'
        switch (item.collection) {
            case "PagerDuty Services":
                icon = 'ambulance'
                break
        }
        return {
            inputLabel: true,
            icon,
            text: item.name,
        }
    },

    envFilter: (item: Secret, envId) => item.env_id === envId,
})
