import { type HelmTagFormat, type NewHelmTagFormat } from "@platzio/sdk";
import { createCollection } from "./collection";

export const createHelmTagFormatsCollection = () =>
  createCollection<HelmTagFormat, NewHelmTagFormat, HelmTagFormat, void>({
    url: "/api/v2/helm-tag-formats",

    sortFunc(x, y) {
      return y.created_at.localeCompare(x.created_at);
    },

    formatItem: (item: HelmTagFormat) => ({
      inputLabel: false,
      icon: "tag",
      text: item.pattern,
    }),
  });
