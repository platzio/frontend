import { type HelmChart } from "@platzio/sdk";
import { createCollection } from "./collection";
import { chartFeatures } from "../chart-ext";

export const InjectedHelmChartsCollection = Symbol(
  "InjectedHelmChartsCollection"
);

export type HelmChartsCollection = ReturnType<
  typeof createCollection<HelmChart, void, HelmChart, void>
>;

export const createHelmChartsCollection = () => {
  return createCollection<HelmChart, void, HelmChart, void>({
    url: "/api/v2/helm-charts",

    sortFunc(x, y) {
      return y.created_at.localeCompare(x.created_at);
    },

    formatItem: (item: HelmChart) => ({
      inputLabel: false,
      icon: "play",
      text: item.image_tag,
    }),

    initialFilters: {
      in_use: true,
    },
  });
};

export function chartIcon(chart?: HelmChart): string | undefined {
  const features = chartFeatures(chart);
  if (features) {
    return features.display?.icon?.font_awesome;
  }
}

export function chartForUpgrade(
  helmChartsCollection: HelmChartsCollection,
  current: HelmChart
): HelmChart | undefined {
  const newer = helmChartsCollection.all
    .filter((chart) => current.helm_registry_id == chart.helm_registry_id)
    .filter((chart) => chart.created_at.localeCompare(current.created_at) == 1)
    .filter((chart) => current.parsed_branch === chart.parsed_branch)
    .filter((chart) => chart.available);
  return (newer || [])[0];
}
