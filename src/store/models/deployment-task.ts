import { CollectionItem, createCollection } from './collection'

export interface DeploymentInstallTask {
    helm_chart_id: string;
    config_inputs: Record<string, any>;
    values_override: Record<string, any>;
}

export interface DeploymentUpgradeTask {
    helm_chart_id: string;
    prev_helm_chart_id?: string;
    config_inputs: Record<string, any>;
    config_delta?: Record<string, any>;
    values_override: Record<string, any>;
}

export interface DeploymentReinstallTask {
    reason: string;
}

export interface DeploymentRecreaseTask {
    old_cluster_id: string;
    old_namespace: string;
    new_cluster_id: string;
    new_namespace: string;
}

export interface DeploymentUninstallTask {
    dummy?: null;
}

export interface DeploymentInvokeActionTask {
    helm_chart_id: string;
    action_id: string;
    body: Record<string, any>;
}

export interface DeploymentRestartK8sResourceTask {
    resource_id: string;
    resource_name: string;
}

export interface DeploymentTaskOperation {
    Install?: DeploymentInstallTask;
    Upgrade?: DeploymentUpgradeTask;
    Reinstall?: DeploymentReinstallTask;
    Recreate?: DeploymentRecreaseTask;
    Uninstall?: DeploymentUninstallTask;
    InvokeAction?: DeploymentInvokeActionTask;
    RestartK8sResource?: DeploymentRestartK8sResourceTask;
}

export enum DeploymentTaskStatus {
    Pending = 'Pending',
    Started = 'Started',
    Failed = 'Failed',
    Done = 'Done',
}

export interface DeploymentTask extends CollectionItem {
    created_at: string;
    deployment_id: string;
    operation: DeploymentTaskOperation;
    status: DeploymentTaskStatus;
    reason?: string;
    user_id?: string;
}

export interface DeploymentTaskFilter {
    deployment_id: string;
}

export const collection = createCollection<DeploymentTask, DeploymentTaskFilter>({
    url: '/api/v2/deployment-tasks',

    sortFunc(x, y) {
        return y.created_at.localeCompare(x.created_at)
    },

    formatItem: (item: DeploymentTask) => ({
        icon: 'tasks',
        text: Object.keys(item.operation)[0],
    }),

    initialFilters: {
        deployment_id: '123e4567-e89b-12d3-a456-426614174000',
    }
})
