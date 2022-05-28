import { RouteRecordRaw } from 'vue-router'
import Root from './Root.vue'
import Users from './Users.vue'
import Envs from './envs/Root.vue'
import EnvPage from './envs/EnvPage.vue'
import HelmRegistries from './helm/HelmRegistries.vue'
import HelmRegistryPage from './helm/HelmRegistryPage.vue'
import HelmTagFormats from './helm/HelmTagFormats.vue'
import K8sClusters from './k8s-clusters/K8sClusters.vue'
import ClusterPage from './k8s-clusters/ClusterPage.vue'

const children: RouteRecordRaw[] = [
    {
        name: 'admin.users',
        path: 'users',
        component: Users,
    },
    {
        name: 'admin.envs',
        path: 'envs',
        component: Envs,
        children: [
            {
                name: 'admin.envs.page',
                path: ':envId',
                props: true,
                component: EnvPage,
            }
        ],
    },
    {
        name: 'admin.helm-registries',
        path: 'helm-registries',
        component: HelmRegistries,
        children: [
            {
                name: 'admin.helm-registry-page',
                path: ':id',
                props: true,
                component: HelmRegistryPage
            },
        ]
    },
    {
        name: 'admin.k8s-clusters',
        path: 'k8s',
        component: K8sClusters,
        children: [
            {
                name: 'admin.k8s-cluster-page',
                path: ':id',
                props: true,
                component: ClusterPage,
            },
        ]
    },
    {
        name: 'admin.tag-formats',
        path: 'tag-formats',
        component: HelmTagFormats,
    },
]

const routes: RouteRecordRaw[] = [
    {
        name: 'admin',
        path: '/admin',
        component: Root,
        children,
        redirect: { name: children[0].name },
    },
]

export default routes
