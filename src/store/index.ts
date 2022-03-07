import { computed, inject, watch } from 'vue'
import { createAuth } from './auth'
import { createCollections } from './collections'
import { startWsUpdates } from './ws'

export function createStore() {
    const auth = createAuth()
    const { collections, tableNameToCollection } = createCollections()
    const wsUpdates = startWsUpdates({ collections, tableNameToCollection })

    watch(() => auth.ready, (isReady: boolean) => {
        if (isReady) {
            wsUpdates.start()
            for (const collection of Object.values(collections)) {
                collection.readAllItems()
            }
        } else {
            wsUpdates.stop()
            for (const collection of Object.values(collections)) {
                collection.reset()
            }
        }
    })

    const modules = [auth, wsUpdates, ...Object.values(collections)]

    const ready = computed(() => modules.every(mod => mod.ready))
    const loadingProgress = computed(() => modules.reduce((sum, mod) => sum + (mod.ready ? 100 : 0), 0) / modules.length)
    const loadingStatus = computed(() => modules.reduce((status, mod) => mod.status || status, null as string | null))

    auth.start()

    return {
        auth,
        collections,
        tableNameToCollection,
        wsUpdates,
        ready,
        loadingProgress,
        loadingStatus,
    }
}

export const storeSymbol = Symbol('store')
export const useStore = () => inject<ReturnType<typeof createStore>>(storeSymbol)
