import { type RouteRecordRaw } from "vue-router";
import PlatzLogin from "./PlatzLogin.vue";
import PlatzOAuthCallback from "./PlatzOAuthCallback.vue";
import PlatzLogout from "./PlatzLogout.vue";

const routes: RouteRecordRaw[] = [
  {
    name: "auth.login",
    path: "/auth/login",
    component: PlatzLogin,
  },
  {
    name: "auth.google-callback",
    path: "/auth/google/callback",
    component: PlatzOAuthCallback,
  },
  {
    name: "auth.logout",
    path: "/auth/logout",
    component: PlatzLogout,
  },
];

export default routes;
