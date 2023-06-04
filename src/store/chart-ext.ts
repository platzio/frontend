import {
    HelmChart,
    ChartExtActions,
    ChartExtActionsV0,
    ChartExtActionV0,
    ChartExtCardinality,
    ChartExtFeaturesV0,
    ChartExtFeaturesV1Beta1,
    ChartExtFeaturesV1Beta2,
    ChartExtFeaturesSpec,
    ChartExtIngressHostnameFormat,
    ChartExtVersionV1Beta2,
    ChartExtVersionV1Beta1,
} from "@platzio/sdk";

function isActionSchemaV0(
    actions: ChartExtActions
): actions is ChartExtActionsV0 {
    return (actions as ChartExtActionsV0).schema_version !== undefined;
}

export function chartActionsSchema(chart: HelmChart): ChartExtActionV0[] {
    if (!chart.actions_schema) {
        return [];
    }
    if (isActionSchemaV0(chart.actions_schema)) {
        return chart.actions_schema.actions;
    }
    const actions = chart.actions_schema;
    return actions.map((action) => action.spec);
}

function isChartFeaturesV1Beta1(
    features:
        | ChartExtFeaturesV0
        | ChartExtFeaturesV1Beta1
        | ChartExtFeaturesV1Beta2
): features is ChartExtFeaturesV1Beta1 {
    return (
        (features as ChartExtFeaturesV1Beta1).apiVersion ==
        ChartExtVersionV1Beta1.PlatzIoV1beta1
    );
}

function isChartFeaturesV1Beta2(
    features:
        | ChartExtFeaturesV0
        | ChartExtFeaturesV1Beta1
        | ChartExtFeaturesV1Beta2
): features is ChartExtFeaturesV1Beta2 {
    return (
        (features as ChartExtFeaturesV1Beta2).apiVersion ==
        ChartExtVersionV1Beta2.PlatzIoV1beta2
    );
}

export function chartFeatures(
    chart?: HelmChart
): ChartExtFeaturesSpec | undefined {
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
            enabled: !!spec.standard_ingress,
            hostname_format: ChartExtIngressHostnameFormat.KindAndName,
        },
        display: {
            name: "DeploymentName",
        },
        cardinality: spec.cardinality || ChartExtCardinality.Many,
        reinstall_dependencies: true,
        node_selector_paths: [],
        tolerations_paths: [],
    };
}
