import { UserDeploymentRole } from './models/deployment-permission';
import { HelmChart } from './models/helm-chart';

//---------//
// Actions //
//---------//

export interface HelmChartActionSchemaV0 {
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

export interface HelmChartActionSchemaV1 {
    apiVersion: string;
    kind: string;
    spec: HelmChartActionSchemaV0;
}

export enum HelmChartActionEndpoint {
    StandardIngress = 'standard_ingress',
}

export interface ChartExtActionTarget {
    endpoint: string;
    path: string;
    method: string;
}

export interface HelmChartActionsSchemaV0 {
    schema_version: number;
    actions: HelmChartActionSchemaV0[];
}

export type HelmChartActionsSchemaV1 = HelmChartActionSchemaV1[];

function isActionSchemaV0(actions: HelmChartActionsSchemaV0 | HelmChartActionsSchemaV1): actions is HelmChartActionsSchemaV0 {
    return (actions as HelmChartActionsSchemaV0).schema_version !== undefined
}

export function chartActionsSchema(chart: HelmChart): HelmChartActionSchemaV0[] {
    if (!chart.actions_schema) {
        return []
    }
    if (isActionSchemaV0(chart.actions_schema)) {
        return chart.actions_schema.actions
    }
    return chart.actions_schema.map(action => action.spec)
}

//----------//
// Features //
//----------//

export interface HelmChartFeaturesV0 {
    standard_ingress: boolean;
    status?: HelmChartStatusFeature;
    cardinality?: HelmChartCardinality;
}

export interface HelmChartFeaturesV1 {
    apiVersion: string;
    kind: string;
    spec: HelmChartFeaturesV0;
}

export interface HelmChartStatusFeature {
    endpoint: HelmChartActionEndpoint;
    path: string;
    refresh_interval_secs: number;
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

function isChartFeaturesV1(features: HelmChartFeaturesV0 | HelmChartFeaturesV1): features is HelmChartFeaturesV1 {
    return (features as HelmChartFeaturesV1).apiVersion !== undefined
}

export function chartFeatures(chart: HelmChart): HelmChartFeaturesV0 | null {
    if (!chart.features) {
        return null
    }
    if (isChartFeaturesV1(chart.features)) {
        return chart.features.spec
    }
    return chart.features
}

//----------//
// ValuesUi //
//----------//

export type HelmChartUiInputType =
    'text' |
    'number' |
    'array' |
    'CollectionSelect' |
    'RadioSelect' |
    'Checkbox' |
    'DaysAndHour';

export type DbTableOrDeploymentResource = DeploymentResourceCollection | string;

export interface HelmChartUiInput {
    id: string;
    type: HelmChartUiInputType;
    itemType?: HelmChartUiInputType;
    label: string;
    collection?: DbTableOrDeploymentResource;
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

//-----------//
// Resources //
//-----------//

export interface DeploymentResourceCollection {
    deployment: string;
    type: string;
}

export function isDeploymentResourceCollection(collection: DbTableOrDeploymentResource): collection is DeploymentResourceCollection {
    return (collection as DeploymentResourceCollection).deployment !== undefined
}
