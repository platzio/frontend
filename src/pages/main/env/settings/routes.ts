import { RouteRecordRaw } from 'vue-router'
import Root from './Root.vue'
import DeploymentPermissions from './deployment-permissions/Root.vue'
import UserRoles from './user-permissions/Root.vue'
import Secrets from './secrets/Root.vue'

const children: RouteRecordRaw[] = [
    {
        name: 'env.settings.deployment-permissions',
        path: 'deployment-permissions',
        component: DeploymentPermissions,
    },
    {
        name: 'env.settings.user-roles',
        path: 'user-roles',
        component: UserRoles,
    },
    {
        name: 'env.settings.secrets',
        path: 'secrets',
        component: Secrets,
    },
]

const routes: RouteRecordRaw[] = [
    {
        name: 'env.settings',
        path: 'settings',
        component: Root,
        children,
        redirect: { name: children[0].name },
    },
]

export default routes
