import { CollectionItem, createCollection } from './collection'
import { UserDeploymentRole } from './deployment-permission';

export interface HelmChartActionSchema {
    id: string;
    allowed_role: UserDeploymentRole;
    allowed_on_statuses?: string[];
    dangerous?: boolean;
    endpoint: string;
    path: string;
    method: string;
    title: string;
    fontawesome_icon?: string;
    description: string;
    ui_schema?: HelmChartUiSchema;
}

export interface ChartExtActionTarget {
    endpoint: string;
    path: string;
    method: string;
}

export interface HelmChartActionsSchema {
    schema_version: number;
    actions: HelmChartActionSchema[];
}

export interface HelmChartFeatures {
    standard_ingress: boolean;
    status?: HelmChartStatusFeature;
    cardinality?: HelmChartCardinality;
}

export interface HelmChartStatusFeature {
    endpoint: HelmChartActionEndpoint;
    path: string;
    refresh_interval_secs: number;
}

export enum HelmChartActionEndpoint {
    StandardIngress = 'standard_ingress',
}

export enum HelmChartCardinality {
    Many = 'Many',
    OnePerCluster = 'OnePerCluster',
}

export interface FieldValue {
    field: string;
    value: any;
}

export interface FieldOption {
    value: any;
    label?: string;
    helpText?: string;
}

export type HelmChartUiInputType =
    'text' |
    'number' |
    'array' |
    'CollectionSelect' |
    'RadioSelect' |
    'Checkbox' |
    'DaysAndHour';

export interface HelmChartUiInput {
    id: string;
    type: HelmChartUiInputType;
    itemType?: HelmChartUiInputType;
    label: string;
    collection?: string;
    initialValue: string;
    helpText?: string;
    required?: boolean;
    options?: FieldOption[];
    showIfAll?: FieldValue[];
    filters?: FieldValue[];
    minimum?: number;
    maximum?: number;
    step?: number;
}

export interface HelmChartUiSchema {
    inputs: HelmChartUiInput[];
    outputs: Record<string, any>;
}

export interface HelmChart extends CollectionItem {
    created_at: string;
    helm_registry_id: string;
    image_digest: string;
    image_tag: string;
    available: boolean;
    values_ui?: HelmChartUiSchema;
    actions_schema?: HelmChartActionsSchema;
    features?: HelmChartFeatures;
}

export const collection = createCollection<HelmChart>({
    url: '/api/v1/helm-charts',

    sortFunc(x, y) {
        return y.created_at.localeCompare(x.created_at)
    },

    formatItem: (item: HelmChart) => ({
        icon: 'play',
        text: item.image_tag,
    })
})
