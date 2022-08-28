import { App } from "vue";
import PlatzLogo from "./PlatzLogo.vue";
import PlatzProgressPage from "./PlatzProgressPage.vue";
import PlatzError from "./PlatzError.vue";
import PlatzMoment from "./PlatzMoment.vue";
import PlatzReason from "./PlatzReason.vue";

export function installComponents(app: App) {
  app.component("PlatzLogo", PlatzLogo);
  app.component("PlatzProgressPage", PlatzProgressPage);
  app.component("PlatzError", PlatzError);
  app.component("PlatzMoment", PlatzMoment);
  app.component("PlatzReason", PlatzReason);
}
