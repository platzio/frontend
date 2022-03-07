import { RouteRecordRaw } from 'vue-router'
import authRoutes from './pages/auth/routes'
import mainRoutes from './pages/main/routes'

const routes: RouteRecordRaw[] = [
    ...authRoutes,
    ...mainRoutes,
]

export default routes
