import { type RouteRecordRaw } from "vue-router";
import PlatzDeployments from "./PlatzDeployments.vue";
import DeploymentCollection from "./DeploymentCollection.vue";
import DeploymentPage from "./page/DeploymentPage.vue";
import K8sResources from "./page/K8sResources.vue";
import DeploymentHistory from "./page/DeploymentHistory.vue";
import DeploymentOverview from "./page/DeploymentOverview.vue";

const routes: RouteRecordRaw[] = [
  {
    name: "env.deployments",
    path: "deployments",
    component: PlatzDeployments,
    props: true,
    children: [
      {
        path: ":kindId",
        children: [
          {
            name: "env.deployments.list",
            path: "",
            component: DeploymentCollection,
            props: true,
          },
          {
            path: ":id",
            component: DeploymentPage,
            props: true,
            children: [
              {
                name: "env.deployments.page",
                path: "",
                component: DeploymentOverview,
                props: true,
              },
              {
                name: "env.deployments.page.resources",
                path: "resources",
                component: K8sResources,
                props: true,
              },
              {
                name: "env.deployments.page.history",
                path: "history",
                component: DeploymentHistory,
                props: true,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routes;
