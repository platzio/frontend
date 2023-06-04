import { HelmTagFormat, NewHelmTagFormat } from "@platzio/sdk";
import { createCollection } from "./collection";

export const collection = createCollection<
    HelmTagFormat,
    NewHelmTagFormat,
    HelmTagFormat,
    void
>({
    url: "/api/v2/helm-tag-formats",

    sortFunc(x, y) {
        return y.created_at.localeCompare(x.created_at);
    },

    formatItem: (item: HelmTagFormat) => ({
        icon: "tag",
        text: item.pattern,
    }),
});
