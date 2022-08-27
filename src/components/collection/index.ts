import { App } from "vue";
import PlatzCollection from "./PlatzCollection.vue";
import PlatzCollectionItem from "./PlatzCollectionItem.vue";
import PlatzItemWithActions from "./PlatzItemWithActions.vue";
import PlatzLinkedItem from "./PlatzLinkedItem.vue";

export function installComponents(app: App) {
  app.component("PlatzCollection", PlatzCollection);
  app.component("PlatzCollectionItem", PlatzCollectionItem);
  app.component("PlatzItemWithActions", PlatzItemWithActions);
  app.component("PlatzLinkedItem", PlatzLinkedItem);
}
