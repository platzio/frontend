import {
    Deployment,
    DeploymentReportedNotice,
    DeploymentReportedNoticeLevel,
} from "@platzio/sdk";

export function deploymentStatusNotices(
    deployment: Deployment
): DeploymentReportedNotice[] {
    const { reported_status } = deployment;
    if (!reported_status) {
        return [];
    }
    if (reported_status.error) {
        return [
            {
                level: DeploymentReportedNoticeLevel.Warning,
                text: reported_status.error,
                extra_info: `Last refreshed ${reported_status.timestamp}`,
            } as DeploymentReportedNotice,
        ];
    }
    const { content } = reported_status;
    if (!content) {
        return [];
    }
    return content.notices || [];
}
