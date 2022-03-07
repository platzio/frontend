import { RouteRecordRaw } from 'vue-router'
import Login from './Login.vue'
import GoogleCallback from './GoogleCallback.vue'
import Logout from './Logout.vue'

const routes: RouteRecordRaw[] = [
    {
        name: 'auth.login',
        path: '/auth/login',
        component: Login,
    },
    {
        name: 'auth.google-callback',
        path: '/auth/google/callback',
        component: GoogleCallback,
    },
    {
        name: 'auth.logout',
        path: '/auth/logout',
        component: Logout,
    },
]

export default routes
