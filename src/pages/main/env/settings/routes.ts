import { type RouteRecordRaw } from "vue-router";
import EnvSettings from "./EnvSettings.vue";
import DeploymentPermissions from "./deployment-permissions/DeploymentPermissions.vue";
import EnvUserPermissions from "./user-permissions/EnvUserPermissions.vue";
import EnvSecrets from "./secrets/EnvSecrets.vue";

const children: RouteRecordRaw[] = [
  {
    name: "env.settings.deployment-permissions",
    path: "deployment-permissions",
    component: DeploymentPermissions,
  },
  {
    name: "env.settings.user-roles",
    path: "user-roles",
    component: EnvUserPermissions,
  },
  {
    name: "env.settings.secrets",
    path: "secrets",
    component: EnvSecrets,
  },
];

const routes: RouteRecordRaw[] = [
  {
    name: "env.settings",
    path: "settings",
    component: EnvSettings,
    children,
    redirect: { name: children[0].name },
  },
];

export default routes;
