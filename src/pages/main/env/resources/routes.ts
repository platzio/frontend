import { RouteRecordRaw } from "vue-router";
import PlatzResources from "./PlatzResources.vue";
import ResourceList from "./ResourceList.vue";
import ResourcePage from "./ResourcePage.vue";

const routes: RouteRecordRaw[] = [
  {
    name: "env.resources",
    path: "resources",
    component: PlatzResources,
    props: true,
    children: [
      {
        name: `env.resources.list`,
        path: ":resourceTypeId",
        component: ResourceList,
        props: true,
        children: [
          {
            name: `env.resources.page`,
            path: ":id",
            component: ResourcePage,
            props: true,
          },
        ],
      },
    ],
  },
];

export default routes;
