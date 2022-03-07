import { HelmChart } from './models/helm-chart'
import { useStore } from './'

export interface HelmChartVersion {
    branch?: string;
    version: string;
    revision?: string;
    commit?: string;
}

export function parseHelmVersion(chart: HelmChart): HelmChartVersion {
    const match = chart.image_tag.match(/chart-(?<version>\d+\.\d+\.\d+)((-(?<revision>\d+))?(-g(?<commit>[0-9a-zA-Z]+))?-(?<branch>[-\w]+))?/)
    if (!match || !match.groups) {
        return {
            version: chart.image_tag
        } as HelmChartVersion
    }
    return {
        branch: match.groups.branch,
        version: match.groups.version,
        revision: match.groups.revision,
        commit: match.groups.commit,
    } as HelmChartVersion
}

export function chartForUpgrade(current: HelmChart): HelmChart | undefined {
    const parsed_current = parseHelmVersion(current)
    const store = useStore()
    const newer = store!.collections.helmCharts.all
        .filter(chart => current.helm_registry_id == chart.helm_registry_id)
        .filter(chart => chart.created_at.localeCompare(current.created_at) == 1)
        .filter(chart => parsed_current.branch == parseHelmVersion(chart).branch)
        .filter(chart => chart.available)
    return newer[0]
}
