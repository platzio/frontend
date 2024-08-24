import { type RouteRecordRaw } from "vue-router";
import PlatzEnvs from "./PlatzEnvs.vue";
import PlatzEnvPage from "./PlatzEnvPage.vue";
import deploymentRoutes from "./deployments/routes";
import deploymentResourceRoutes from "./resources/routes";
import settingsRoutes from "./settings/routes";
import playgroundRoutes from "./playground/routes";

const routes: RouteRecordRaw[] = [
  {
    name: "envs",
    path: "envs",
    component: PlatzEnvs,
    children: [
      {
        name: "envs.env",
        path: ":envId",
        component: PlatzEnvPage,
        props: true,
        redirect: { name: "env.deployments" },
        children: [
          ...deploymentRoutes,
          ...deploymentResourceRoutes,
          ...settingsRoutes,
          ...playgroundRoutes,
        ],
      },
    ],
  },
];

export default routes;
