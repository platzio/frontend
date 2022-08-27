import { RouteRecordRaw } from "vue-router";
import PlatzEnvs from "./PlatzEnvs.vue";
import PlatzEnv from "./PlatzEnv.vue";
import deploymentRoutes from "./deployments/routes";
import deploymentResourceRoutes from "./resources/routes";
import settingsRoutes from "./settings/routes";

const routes: RouteRecordRaw[] = [
  {
    name: "envs",
    path: "envs",
    component: PlatzEnvs,
    children: [
      {
        name: "envs.env",
        path: ":envId",
        component: PlatzEnv,
        props: true,
        redirect: { name: "env.deployments" },
        children: [...deploymentRoutes, ...deploymentResourceRoutes, ...settingsRoutes],
      },
    ],
  },
];

export default routes;
