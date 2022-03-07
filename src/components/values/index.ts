import { App } from 'vue'

import ArrayValue from './ArrayValue.vue'
import CheckboxValue from './CheckboxValue.vue'
import CollectionValue from './CollectionValue.vue'
import DaysHourValue from './DaysHourValue.vue'
import ConfigValue from './ConfigValue.vue'
import RadioValue from './RadioValue.vue'
import PlainValue from './PlainValue.vue'

export function installComponents(app: App) {
    app.component('ArrayValue', ArrayValue)
    app.component('CheckboxValue', CheckboxValue)
    app.component('CollectionValue', CollectionValue)
    app.component('DaysHourValue', DaysHourValue)
    app.component('ConfigValue', ConfigValue)
    app.component('RadioValue', RadioValue)
    app.component('PlainValue', PlainValue)
}
