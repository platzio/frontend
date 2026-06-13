import { computed, reactive } from "vue";
import { createCollections } from "./collections";
import { DbTable, type DbEvent } from "@platzio/sdk";

// Subprotocol used to carry the access token to the backend websocket. Browsers
// cannot set an Authorization header on a WebSocket, so the token is passed as a
// subprotocol value, which the browser sends in the Sec-WebSocket-Protocol
// header. Must match WS_AUTH_PROTOCOL on the backend.
const WS_AUTH_PROTOCOL = "platz-auth-bearer";

const ACCESS_TOKEN_ITEM = "access_token";

// A subscription identifies the (collection, environment) pair a view needs.
// `envId` is undefined for global (non-environment-scoped) collections.
function subscriptionKey(table: DbTable, envId?: string): string {
  return `${table}|${envId ?? ""}`;
}

function parseSubscriptionKey(key: string): { table: DbTable; envId?: string } {
  const sep = key.indexOf("|");
  const table = key.slice(0, sep) as DbTable;
  const envId = key.slice(sep + 1) || undefined;
  return { table, envId };
}

export function startWsUpdates({
  dbTableToCollection,
}: ReturnType<typeof createCollections>) {
  const state = reactive({
    ready: false,
    started: false,
    status: undefined as string | undefined,
    socket: undefined as WebSocket | undefined,
  });

  // Refcounted active subscriptions, keyed by subscriptionKey(). Refcounting
  // lets several views share the same (collection, env) and only sends the
  // unsubscribe once the last of them goes away.
  const subscriptions = new Map<string, number>();

  const ready = computed(() => state.ready);
  const status = computed(() => state.status);

  const sendIfOpen = (message: object) => {
    if (state.socket && state.socket.readyState === WebSocket.OPEN) {
      state.socket.send(JSON.stringify(message));
    }
  };

  const subscribe = (table: DbTable, envId?: string) => {
    const key = subscriptionKey(table, envId);
    const count = subscriptions.get(key) ?? 0;
    subscriptions.set(key, count + 1);
    if (count === 0) {
      sendIfOpen({ type: "subscribe", table, env_id: envId });
    }
  };

  const unsubscribe = (table: DbTable, envId?: string) => {
    const key = subscriptionKey(table, envId);
    const count = subscriptions.get(key) ?? 0;
    if (count <= 1) {
      subscriptions.delete(key);
      sendIfOpen({ type: "unsubscribe", table, env_id: envId });
    } else {
      subscriptions.set(key, count - 1);
    }
  };

  // Re-send every active subscription. Called on (re)connect, since the server
  // tracks subscriptions per connection and a new connection starts empty.
  const resendSubscriptions = () => {
    for (const key of subscriptions.keys()) {
      const { table, envId } = parseSubscriptionKey(key);
      sendIfOpen({ type: "subscribe", table, env_id: envId });
    }
  };

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
      // Restore subscriptions on the fresh connection.
      resendSubscriptions();
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
    subscribe,
    unsubscribe,
  });
}
