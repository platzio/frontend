import { CollectionItem, createCollection } from './collection'
import { ChartExtActionTarget, HelmChartUiSchema } from '../chart-ext';
import { UserDeploymentRole } from './deployment-permission';

export interface DeploymentResourceType extends CollectionItem {
    created_at: string;
    env_id?: string;
    deployment_kind: string;
    key: string;
    spec: ChartExtResourceTypeSpec;
}

export interface ChartExtResourceTypeSpec {
    name_singular: string;
    name_plural: string;
    fontawesome_icon: string;
    global: boolean;
    values_ui: HelmChartUiSchema;
    lifecycle: ChartExtResourceLifecycle;
}

export interface ChartExtResourceLifecycle {
    create?: ResourceLifecycle;
    update?: ResourceLifecycle;
    delete?: ResourceLifecycle;
}

export interface ResourceLifecycle {
    allowed_role?: UserDeploymentRole;
    target?: ChartExtActionTarget;
}

export const collection = createCollection<DeploymentResourceType>({
    url: '/api/v1/deployment-resource-types',

    sortFunc(x, y) {
        return x.spec.name_singular.localeCompare(y.spec.name_singular)
    },

    formatItem: (item: DeploymentResourceType) => ({
        icon: 'city',
        text: item.spec.name_singular,
    })
})
