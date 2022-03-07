import { App } from 'vue'
import * as base from './base'
import * as collection from './collection'
import * as inputs from './inputs'
import * as values from './values'

import Deployment from './Deployment.vue'
import DeploymentStatus from './DeploymentStatus.vue'
import DeploymentWarnings from './DeploymentWarnings.vue'
import HelmChart from './HelmChart.vue'
import HelmRegistry from './HelmRegistry.vue'
import K8sClusterName from './K8sClusterName.vue'
import K8sResourceStatus from './K8sResourceStatus.vue'
import User from './User.vue'
import Env from './Env.vue'
import Markdown from './Markdown.vue'

export function installComponents(app: App) {
    base.installComponents(app)
    collection.installComponents(app)
    inputs.installComponents(app)
    values.installComponents(app)

    app.component('Deployment', Deployment)
    app.component('DeploymentStatus', DeploymentStatus)
    app.component('DeploymentWarnings', DeploymentWarnings)
    app.component('HelmChart', HelmChart)
    app.component('HelmRegistry', HelmRegistry);
    app.component('K8sClusterName', K8sClusterName)
    app.component('K8sResourceStatus', K8sResourceStatus)
    app.component('User', User)
    app.component('Env', Env)
    app.component('Markdown', Markdown)
}
