import { UserDeploymentRole } from "./models/deployment-permission";
import { HelmChart } from "./models/helm-chart";

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
    StandardIngress = "standard_ingress",
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

function isActionSchemaV0(
    actions: HelmChartActionsSchemaV0 | HelmChartActionsSchemaV1
): actions is HelmChartActionsSchemaV0 {
    return (actions as HelmChartActionsSchemaV0).schema_version !== undefined;
}

export function chartActionsSchema(
    chart: HelmChart
): HelmChartActionSchemaV0[] {
    if (!chart.actions_schema) {
        return [];
    }
    if (isActionSchemaV0(chart.actions_schema)) {
        return chart.actions_schema.actions;
    }
    return chart.actions_schema.map((action) => action.spec);
}

//----------//
// Features //
//----------//

export interface HelmChartFeaturesV0 {
    standard_ingress: boolean;
    status?: HelmChartStatusFeature;
    cardinality?: HelmChartCardinality;
}

export interface HelmChartFeaturesV1Beta1 {
    apiVersion: "platz.io/v1beta1";
    kind: string;
    spec: HelmChartFeaturesV0;
}

export interface HelmChartFeaturesV1Beta2 {
    apiVersion: "platz.io/v1beta2";
    kind: string;
    spec: HelmChartFeaturesV1Beta2Spec;
}

export interface HelmChartFeaturesV1Beta2Spec {
    ingress: {
        enabled: boolean;
        hostname_format: ChartExtIngressHostnameFormat;
    };
    cardinality: HelmChartCardinality;
    reinstall_dependencies: boolean;
    node_selector_paths: string[][];
    tolerations_paths: string[][];
    display: ChartExtDeploymentDisplay;
}

export enum ChartExtIngressHostnameFormat {
    Name = "Name",
    KindAndName = "KindAndName",
}

export interface HelmChartStatusFeature {
    endpoint: HelmChartActionEndpoint;
    path: string;
    refresh_interval_secs: number;
}

export enum HelmChartCardinality {
    Many = "Many",
    OnePerCluster = "OnePerCluster",
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

export interface ChartExtDeploymentDisplay {
    name?: ChartExtDeploymentDisplayName;
    icon?: ChartExtDeploymentDisplayIcon;
}

export enum ChartExtDeploymentDisplayName {
    DeploymentName = "DeploymentName",
    InputField = "InputField",
}

export interface ChartExtDeploymentDisplayIcon {
    font_awesome: string;
}

function isChartFeaturesV1Beta1(
    features:
        | HelmChartFeaturesV0
        | HelmChartFeaturesV1Beta1
        | HelmChartFeaturesV1Beta2
): features is HelmChartFeaturesV1Beta1 {
    return (
        (features as HelmChartFeaturesV1Beta1).apiVersion === "platz.io/v1beta1"
    );
}

function isChartFeaturesV1Beta2(
    features:
        | HelmChartFeaturesV0
        | HelmChartFeaturesV1Beta1
        | HelmChartFeaturesV1Beta2
): features is HelmChartFeaturesV1Beta2 {
    return (
        (features as HelmChartFeaturesV1Beta2).apiVersion === "platz.io/v1beta2"
    );
}

export function chartFeatures(
    chart?: HelmChart
): HelmChartFeaturesV1Beta2Spec | undefined {
    if (!chart || !chart.features) {
        return undefined;
    }

    if (isChartFeaturesV1Beta2(chart.features)) {
        return chart.features.spec;
    }

    const spec = isChartFeaturesV1Beta1(chart.features)
        ? chart.features.spec
        : chart.features;
    return {
        ingress: {
            enabled: spec.standard_ingress,
            hostname_format: ChartExtIngressHostnameFormat.KindAndName,
        },
        display: {
            name: ChartExtDeploymentDisplayName.DeploymentName,
        },
        cardinality: spec.cardinality || HelmChartCardinality.Many,
        reinstall_dependencies: true,
        node_selector_paths: [],
        tolerations_paths: [],
    };
}

//----------//
// ValuesUi //
//----------//

export type HelmChartUiInputType =
    | "text"
    | "number"
    | "array"
    | "CollectionSelect"
    | "RadioSelect"
    | "Checkbox"
    | "DaysAndHour";

export type DbTableOrDeploymentResource = DeploymentResourceCollection | string;

export interface HelmChartUiInput {
    id: string;
    type: HelmChartUiInputType;
    itemType?: HelmChartUiInputType;
    label: string;
    collection?: DbTableOrDeploymentResource;
    initialValue?: any;
    helpText?: string;
    required?: boolean;
    sensitive?: boolean;
    options?: FieldOption[];
    showIfAll?: FieldValue[];
    filters?: FieldValue[];
    minimum?: number;
    maximum?: number;
    step?: number;
}

export interface HelmChartUiSchema {
    apiVersion?: "platz.io/v1beta1";
    kind?: "ValuesUi";
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

export function isDeploymentResourceCollection(
    collection: DbTableOrDeploymentResource
): collection is DeploymentResourceCollection {
    return (
        (collection as DeploymentResourceCollection).deployment !== undefined
    );
}
