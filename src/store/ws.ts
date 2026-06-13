import { computed, reactive } from "vue";
import { createCollections } from "./collections";
import { type DbEvent } from "@platzio/sdk";

// Subprotocol used to carry the access token to the backend websocket. Browsers
// cannot set an Authorization header on a WebSocket, so the token is passed as a
// subprotocol value, which the browser sends in the Sec-WebSocket-Protocol
// header. Must match WS_AUTH_PROTOCOL on the backend.
const WS_AUTH_PROTOCOL = "platz-auth-bearer";

const ACCESS_TOKEN_ITEM = "access_token";

export function startWsUpdates({
  dbTableToCollection,
}: ReturnType<typeof createCollections>) {
  const state = reactive({
    ready: false,
    started: false,
    status: undefined as string | undefined,
    socket: undefined as WebSocket | undefined,
  });

  const ready = computed(() => state.ready);
  const status = computed(() => state.status);

  const stop = () => {
    state.ready = false;
    state.started = false;
    state.status = "not connected";
    if (state.socket) {
      state.socket.close();
      state.socket = undefined;
    }
  };

  const start = () => {
    if (state.socket) {
      return;
    }

    const accessToken = localStorage.getItem(ACCESS_TOKEN_ITEM);
    if (!accessToken) {
      // Without a token the backend rejects the connection. Wait for auth to
      // populate the token; index.ts (re)starts updates once auth is ready.
      state.status = "not authenticated";
      return;
    }

    state.started = true;
    state.status = undefined;
    const socket = new WebSocket(
      `${location.protocol === "https:" ? "wss" : "ws"}://${
        location.host
      }/api/v2/ws`,
      [WS_AUTH_PROTOCOL, accessToken]
    );

    socket.onopen = () => {
      state.ready = true;
      state.status = undefined;
    };

    socket.onmessage = (message) => {
      const event = JSON.parse(message.data) as DbEvent;
      const collection = dbTableToCollection(event.table);
      if (collection) {
        switch (event.operation) {
          case "INSERT":
          case "UPDATE":
            collection.readItem(event.data);
            break;
          case "DELETE":
            collection.discardOne(event.data.id);
            break;
        }
      }
    };

    socket.onclose = () => {
      state.ready = false;
      state.status = "disconnected, will try reconnecting soon";
      state.socket = undefined;
      setTimeout(() => {
        if (state.started) {
          start();
        }
      }, 2000);
    };

    state.socket = socket;
  };

  return reactive({
    ready,
    status,
    start,
    stop,
  });
}
