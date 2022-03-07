import { RouteRecordRaw } from 'vue-router'
import Root from './Root.vue'
import envRoutes from './env/routes'
import adminRoutes from './admin/routes'

const children = [
    ...envRoutes,
    ...adminRoutes,
]

const routes: RouteRecordRaw[] = [
    {
        name: 'main',
        path: '/',
        component: Root,
        redirect: { name: children[0].name },
        children,
    },
]

export default routes
