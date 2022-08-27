import { RouteRecordRaw } from "vue-router";
import PlatzDeployments from "./PlatzDeployments.vue";
import DeploymentCollection from "./DeploymentCollection.vue";
import DeploymentPage from "./page/DeploymentPage.vue";

const routes: RouteRecordRaw[] = [
  {
    name: "env.deployments",
    path: "deployments",
    component: PlatzDeployments,
    props: true,
    children: [
      {
        name: `env.deployments.list`,
        path: ":kind",
        component: DeploymentCollection,
        props: true,
        children: [
          {
            name: `env.deployments.page`,
            path: ":id",
            component: DeploymentPage,
            props: true,
          },
        ],
      },
    ],
  },
];

export default routes;
