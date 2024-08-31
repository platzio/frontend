import { type RouteRecordRaw } from "vue-router";
import PlatzAdmin from "./PlatzAdmin.vue";
import UsersAdmin from "./users/UsersAdmin.vue";
import EnvsAdmin from "./envs/EnvsAdmin.vue";
import EnvPage from "./envs/EnvPage.vue";
import HelmRegistries from "./helm/HelmRegistries.vue";
import HelmRegistryPage from "./helm/HelmRegistryPage.vue";
import HelmTagFormats from "./helm/HelmTagFormats.vue";
import K8sClusters from "./k8s-clusters/K8sClusters.vue";
import ClusterPage from "./k8s-clusters/ClusterPage.vue";

const children: RouteRecordRaw[] = [
  {
    name: "admin.users",
    path: "users",
    component: UsersAdmin,
  },
  {
    path: "envs",
    children: [
      {
        name: "admin.envs",
        path: "",
        component: EnvsAdmin,
      },
      {
        name: "admin.envs.page",
        path: ":envId",
        props: true,
        component: EnvPage,
      },
    ],
  },
  {
    path: "helm-registries",
    children: [
      {
        name: "admin.helm-registries",
        path: "",
        component: HelmRegistries,
      },
      {
        name: "admin.helm-registry-page",
        path: ":id",
        props: true,
        component: HelmRegistryPage,
      },
    ],
  },
  {
    path: "k8s",
    children: [
      {
        name: "admin.k8s-clusters",
        path: "",
        component: K8sClusters,
      },
      {
        name: "admin.k8s-cluster-page",
        path: ":id",
        props: true,
        component: ClusterPage,
      },
    ],
  },
  {
    name: "admin.tag-formats",
    path: "tag-formats",
    component: HelmTagFormats,
  },
];

const routes: RouteRecordRaw[] = [
  {
    name: "admin",
    path: "/admin",
    component: PlatzAdmin,
    children,
    redirect: { name: children[0].name },
  },
];

export default routes;
