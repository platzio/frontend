import { type Deployment, DeploymentReportedNoticeLevel } from "@platzio/sdk";

export type DeploymentReportedNoticeWithInfo = {
  level: DeploymentReportedNoticeLevel;
  text: string;
  extra_info?: string;
};

export function deploymentStatusNotices(
  deployment: Deployment
): DeploymentReportedNoticeWithInfo[] {
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
      },
    ];
  }
  const { content } = reported_status;
  if (!content) {
    return [];
  }
  return content.notices || [];
}
