import { type RouteRecordRaw } from "vue-router";
import PlatzMain from "./PlatzMain.vue";
import envRoutes from "./env/routes";
import profileRoutes from "./profile/routes";
import adminRoutes from "./admin/routes";

const children = [...envRoutes, ...profileRoutes, ...adminRoutes];

const routes: RouteRecordRaw[] = [
  {
    name: "main",
    path: "/",
    component: PlatzMain,
    redirect: { name: children[0].name },
    children,
  },
];

export default routes;
