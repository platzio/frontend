import { CollectionItem, createCollection } from './collection'
import { collection as resourceTypes } from './deployment-resource-type'

export interface DeploymentResource extends CollectionItem {
    created_at: string;
    type_id: string;
    deployment_id?: string;
    name: string;
    exists: boolean;
    props: Record<string, any>;
}

export const collection = createCollection<DeploymentResource>({
    url: '/api/v1/deployment-resources',

    sortFunc(x, y) {
        return x.name.localeCompare(y.name)
    },

    formatItem: (item: DeploymentResource) => {
        const resourceType = resourceTypes.getOne(item.type_id)
        return {
            icon: resourceType && resourceType.spec.fontawesome_icon,
            text: item.name,
        }
    }
})
