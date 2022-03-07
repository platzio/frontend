import { Deployment } from "./deployment";

export interface DeploymentReportedMainStatus {
    name: string;
    color: string;
}

export interface DeploymentReportedMetric {
    value: number;
    unit: string;
    short_description: string;
    color?: string;
}

export interface DeploymentReportedStatusContent {
    status: DeploymentReportedMainStatus;
    warnings?: string[];
    primary_metric?: DeploymentReportedMetric;
    metrics?: DeploymentReportedMetric[];
    notices?: DeploymentNotice[];
}

export interface DeploymentReportedStatus {
    timestamp: string;
    get_successful: boolean;
    content?: DeploymentReportedStatusContent;
    error?: string;
}

export enum DeploymentNoticeLevel {
    Info = 'Info',
    Warning = 'Warning',
    Danger = 'Danger',
}

export interface DeploymentNotice {
    level: DeploymentNoticeLevel;
    text: string;
    extra_info?: string;
}

export function deploymentStatusNotices(deployment: Deployment): DeploymentNotice[] {
    const { reported_status } = deployment
    if (!reported_status) {
        return []
    }
    if (reported_status.error) {
        return [{
            level: DeploymentNoticeLevel.Warning,
            text: reported_status.error,
            extra_info: `Last refreshed ${reported_status.timestamp}`,
        } as DeploymentNotice]
    }
    const { content } = reported_status
    if (!content) {
        return []
    }
    const old_warnings = content.warnings ? content.warnings.map(warning => ({
        level: DeploymentNoticeLevel.Warning,
        text: warning,
    } as DeploymentNotice)) : []
    const notices = content.notices || []
    return old_warnings.concat(notices)
}
