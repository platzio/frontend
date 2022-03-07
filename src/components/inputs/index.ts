import { App } from 'vue'

import ArrayInput from './ArrayInput.vue'
import CheckboxInput from './CheckboxInput.vue'
import CollectionInput from './CollectionInput.vue'
import DaysHourInput from './DaysHourInput.vue'
import InputField from './InputField.vue'
import NumberInput from './NumberInput.vue'
import RadioInput from './RadioInput.vue'
import TextInput from './TextInput.vue'
import YamlInput from './YamlInput.vue'

export function installComponents(app: App) {
    app.component('ArrayInput', ArrayInput)
    app.component('CheckboxInput', CheckboxInput)
    app.component('CollectionInput', CollectionInput)
    app.component('DaysHourInput', DaysHourInput)
    app.component('InputField', InputField)
    app.component('NumberInput', NumberInput)
    app.component('RadioInput', RadioInput)
    app.component('TextInput', TextInput)
    app.component('YamlInput', YamlInput)
}
