import { RouteRecordRaw } from 'vue-router'
import Root from './Root.vue'
import Inner from './Inner.vue'
import deploymentRoutes from './deployments/routes'
import deploymentResourceRoutes from './resources/routes'
import settingsRoutes from './settings/routes'

const routes: RouteRecordRaw[] = [
    {
        name: 'envs',
        path: 'envs',
        component: Root,
        children: [
            {
                name: 'envs.env',
                path: ':envId',
                component: Inner,
                props: true,
                redirect: { name: 'env.deployments' },
                children: [
                    ...deploymentRoutes,
                    ...deploymentResourceRoutes,
                    ...settingsRoutes,
                ],
            },
        ],
    },
]

export default routes
