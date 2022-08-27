import { App } from "vue";
import * as base from "./base";
import * as collection from "./collection";
import * as inputs from "./inputs";
import * as values from "./values";

import PlatzDeployment from "./PlatzDeployment.vue";
import PlatzDeploymentStatus from "./PlatzDeploymentStatus.vue";
import PlatzDeploymentWarnings from "./PlatzDeploymentWarnings.vue";
import PlatzHelmChart from "./PlatzHelmChart.vue";
import PlatzHelmRegistry from "./PlatzHelmRegistry.vue";
import PlatzClusterName from "./PlatzClusterName.vue";
import PlatzResourceStatus from "./PlatzResourceStatus.vue";
import PlatzUser from "./PlatzUser.vue";
import PlatzEnv from "./PlatzEnv.vue";
import PlatzMarkdown from "./PlatzMarkdown.vue";

export function installComponents(app: App) {
  base.installComponents(app);
  collection.installComponents(app);
  inputs.installComponents(app);
  values.installComponents(app);

  app.component("PlatzDeployment", PlatzDeployment);
  app.component("PlatzDeploymentStatus", PlatzDeploymentStatus);
  app.component("PlatzDeploymentWarnings", PlatzDeploymentWarnings);
  app.component("PlatzHelmChart", PlatzHelmChart);
  app.component("PlatzHelmRegistry", PlatzHelmRegistry);
  app.component("PlatzClusterName", PlatzClusterName);
  app.component("PlatzResourceStatus", PlatzResourceStatus);
  app.component("PlatzUser", PlatzUser);
  app.component("PlatzEnv", PlatzEnv);
  app.component("PlatzMarkdown", PlatzMarkdown);
}
