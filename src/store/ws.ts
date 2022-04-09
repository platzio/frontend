import { computed, reactive } from 'vue'
import { createCollections } from './collections'

export function startWsUpdates({ tableNameToCollection }: ReturnType<typeof createCollections>) {
    const state = reactive({
        ready: false,
        started: false,
        status: null as string | null,
        socket: undefined as WebSocket | undefined,
    })

    const ready = computed(() => state.ready)
    const status = computed(() => state.status)

    const stop = () => {
        state.ready = false
        state.started = false
        state.status = 'not connected'
        if (state.socket) {
            state.socket.close()
            state.socket = undefined
        }
    }

    const start = () => {
        if (state.socket) {
            return
        }

        state.started = true
        state.status = null
        const socket = new WebSocket(`${(location.protocol === 'https:') ? 'wss' : 'ws'}://${location.host}/api/v2/ws`)

        socket.onopen = () => {
            state.ready = true
            state.status = null
        }

        socket.onmessage = message => {
            const event = JSON.parse(message.data)
            const collection = tableNameToCollection(event.table)
            switch (event.operation) {
                case 'INSERT':
                case 'UPDATE':
                    collection.readItem(event.data)
                    break
                case 'DELETE':
                    collection.discardOne(event.data.id)
                    break
            }
        }

        socket.onclose = () => {
            state.ready = false
            state.status = 'disconnected, will try reconnecting soon'
            state.socket = undefined
            setTimeout(() => {
                if (state.started) {
                    start()
                }
            }, 2000)
        }

        state.socket = socket
    }

    return reactive({
        ready,
        status,
        start,
        stop,
    })
}
