import { App } from 'vue'
import Logo from './Logo.vue'
import CenteredLogo from './CenteredLogo.vue'
import Error from './Error.vue'
import Moment from './Moment.vue'
import Reason from './Reason.vue'

export function installComponents(app: App) {
    app.component('Logo', Logo)
    app.component('CenteredLogo', CenteredLogo)
    app.component('Error', Error)
    app.component('Moment', Moment)
    app.component('Reason', Reason)
}
