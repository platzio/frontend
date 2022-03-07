import { RouteRecordRaw } from 'vue-router'
import Root from './Root.vue'
import DeploymentCollection from './DeploymentCollection.vue'
import DeploymentPage from './DeploymentPage.vue'

const routes: RouteRecordRaw[] = [
    {
        name: 'env.deployments',
        path: 'deployments',
        component: Root,
        props: true,
        children: [{
            name: `env.deployments.list`,
            path: ':kind',
            component: DeploymentCollection,
            props: true,
            children: [
                {
                    name: `env.deployments.page`,
                    path: ':id',
                    component: DeploymentPage,
                    props: true
                },
            ],
        }],
    },
]

export default routes
