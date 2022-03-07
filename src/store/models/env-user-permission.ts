import { CollectionItem, createCollection } from './collection'

export enum EnvUserRole {
    Admin = 'Admin',
    User = 'User',
}

export interface EnvUserPermission extends CollectionItem {
    created_at: string;
    env_id: string;
    user_id: string;
    role: EnvUserRole;
}

export const collection = createCollection<EnvUserPermission>({
    url: '/api/v1/env-user-permissions',

    sortFunc(x, y) {
        return x.created_at.localeCompare(y.created_at)
    },

    formatItem: (item: EnvUserPermission) => ({
        icon: 'key',
        text: item.role
    }),

    envFilter(item, envId) {
        return item.env_id === envId
    },
})
