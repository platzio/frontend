import { CollectionItem, createCollection } from './collection'
import { HelmChartUiSchema } from '../chart-ext';
import { HelmChartActionsSchemaV0, HelmChartActionsSchemaV1 } from '../chart-ext'
import { HelmChartFeaturesV0, HelmChartFeaturesV1 } from '../chart-ext'

export interface HelmChart extends CollectionItem {
    created_at: string;
    helm_registry_id: string;
    image_digest: string;
    image_tag: string;
    available: boolean;
    values_ui?: HelmChartUiSchema;
    actions_schema?: HelmChartActionsSchemaV0 | HelmChartActionsSchemaV1;
    features?: HelmChartFeaturesV0 | HelmChartFeaturesV1;
    error?: string;
}

export const collection = createCollection<HelmChart>({
    url: '/api/v2/helm-charts',

    sortFunc(x, y) {
        return y.created_at.localeCompare(x.created_at)
    },

    formatItem: (item: HelmChart) => ({
        icon: 'play',
        text: item.image_tag,
    })
})
