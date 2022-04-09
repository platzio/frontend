import { CollectionItem, createCollection } from './collection'

export enum UserDeploymentRole {
    Owner = 'Owner',
    Maintainer = 'Maintainer',
}

export interface DeploymentPermission extends CollectionItem {
    created_at: string;
    env_id: string;
    user_id: string;
    kind: string;
    role: UserDeploymentRole;
}

export const collection = createCollection<DeploymentPermission>({
    url: '/api/v2/deployment-permissions',

    sortFunc(x, y) {
        return y.created_at.localeCompare(x.created_at)
    },

    formatItem: (item: DeploymentPermission) => ({
        icon: 'key',
        text: item.role,
    }),

    envFilter(item, envId) {
        return item.env_id === envId
    },
})
