import { App } from 'vue'
import Collection from './Collection.vue'
import CollectionItem from './CollectionItem.vue'
import ItemWithActions from './ItemWithActions.vue'
import LinkedItem from './LinkedItem.vue'

export function installComponents(app: App) {
    app.component('Collection', Collection)
    app.component('CollectionItem', CollectionItem)
    app.component('ItemWithActions', ItemWithActions)
    app.component('LinkedItem', LinkedItem)
}
