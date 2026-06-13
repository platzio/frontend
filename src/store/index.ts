import { computed, inject, onUnmounted, watch } from "vue";
import { createAuth } from "./auth";
import { createCollections } from "./collections";
import { startWsUpdates } from "./ws";

export function createStore() {
  const auth = createAuth();
  const collectionsApi = createCollections();
  const { collections, catalog, envScoped } = collectionsApi;
  const wsUpdates = startWsUpdates(collectionsApi);

  // Load and subscribe an environment's collections on demand. Called by the
  // views that show an environment, and released when they navigate away, so
  // the client only loads and receives events for environments it is viewing.
  const subscribeEnv = (envId: string) => {
    for (const { table, collection } of envScoped) {
      collection.ensureScope({ env_id: envId });
      wsUpdates.subscribe(table, envId);
    }
  };

  const releaseEnv = (envId: string) => {
    for (const { table } of envScoped) {
      wsUpdates.unsubscribe(table, envId);
    }
  };

  watch(
    () => auth.ready,
    (isReady: boolean) => {
      if (isReady) {
        wsUpdates.start();
        // Eagerly load and subscribe the global catalog once; environment data
        // is loaded lazily, per environment, by the views that need it.
        for (const { table, collection } of catalog) {
          collection.ensureScope();
          wsUpdates.subscribe(table);
        }
      } else {
        wsUpdates.stop();
        for (const collection of Object.values(collections)) {
          collection.reset();
        }
      }
    }
  );

  // Readiness reflects only what the app shell needs up front: auth, the live
  // connection, and the global catalog. Per-environment data loads within the
  // views that show it, with their own loading state.
  const modules = [auth, wsUpdates, ...catalog.map(({ collection }) => collection)];

  const ready = computed(() => modules.every((mod) => mod.ready));
  const loadingProgress = computed(
    () =>
      modules.reduce((sum, mod) => sum + (mod.ready ? 100 : 0), 0) /
      modules.length
  );
  const loadingStatus = computed(() =>
    modules.reduce(
      (status, mod) => mod.status || status,
      undefined as string | undefined
    )
  );

  auth.start();

  return {
    auth,
    collections,
    dbTableToCollection: collectionsApi.dbTableToCollection,
    wsUpdates,
    subscribeEnv,
    releaseEnv,
    ready,
    loadingProgress,
    loadingStatus,
  };
}

export const storeSymbol = Symbol("store");
export type Store = ReturnType<typeof createStore>;
export const useStore = () => inject<Store>(storeSymbol);

/// Declare that the current component shows the given environment, loading and
/// subscribing its collections while mounted and releasing them on unmount or
/// when the environment changes. Pass a getter so it tracks reactive changes.
export function useEnvScope(envId: () => string | undefined) {
  const store = useStore();
  let current: string | undefined;

  const apply = (id: string | undefined) => {
    if (current === id) {
      return;
    }
    if (current) {
      store?.releaseEnv(current);
    }
    current = id;
    if (id) {
      store?.subscribeEnv(id);
    }
  };

  watch(envId, apply, { immediate: true });

  onUnmounted(() => {
    if (current) {
      store?.releaseEnv(current);
      current = undefined;
    }
  });
}
