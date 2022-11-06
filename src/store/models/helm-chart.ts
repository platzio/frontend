import { CollectionItem, createCollection } from "./collection";
import { chartFeatures, HelmChartFeaturesV1Beta2, HelmChartUiSchema } from "../chart-ext";
import { HelmChartActionsSchemaV0, HelmChartActionsSchemaV1 } from "../chart-ext";
import { HelmChartFeaturesV0, HelmChartFeaturesV1Beta1 } from "../chart-ext";

export interface HelmChart extends CollectionItem {
  created_at: string;
  helm_registry_id: string;
  image_digest: string;
  image_tag: string;
  available: boolean;
  values_ui?: HelmChartUiSchema;
  actions_schema?: HelmChartActionsSchemaV0 | HelmChartActionsSchemaV1;
  features?: HelmChartFeaturesV0 | HelmChartFeaturesV1Beta1 | HelmChartFeaturesV1Beta2;
  error?: string;
  tag_format_id?: string;
  parsed_version?: string;
  parsed_revision?: string;
  parsed_branch?: string;
  parsed_commit?: string;
}

export interface HelmChartFilters {
  helm_registry_id?: string;
  parsed_branch?: string;
  kind?: string;
  in_use?: boolean;
}

export const collection = createCollection<HelmChart, HelmChartFilters>({
  url: "/api/v2/helm-charts",

  sortFunc(x, y) {
    return y.created_at.localeCompare(x.created_at);
  },

  formatItem: (item: HelmChart) => ({
    icon: "play",
    text: item.image_tag,
  }),

  initialFilters: {
    in_use: true,
  },
});

export function chartIcon(chart?: HelmChart): string | undefined {
  const features = chartFeatures(chart);
  if (features) {
    return features.display.icon?.font_awesome;
  }
}

export function chartForUpgrade(current: HelmChart): HelmChart | undefined {
  const newer = collection.all
    .filter((chart) => current.helm_registry_id == chart.helm_registry_id)
    .filter((chart) => chart.created_at.localeCompare(current.created_at) == 1)
    .filter((chart) => current.parsed_branch === chart.parsed_branch)
    .filter((chart) => chart.available);
  return newer[0];
}
