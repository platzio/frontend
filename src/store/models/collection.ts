import { computed, reactive, readonly } from "vue";
import axios, { AxiosResponse } from "axios";

export interface CollectionItem<ID = string> {
  id: ID;
}

type SortFunction<T> = (x: T, y: T) => number;

export interface CreateCollectionOptions<T, F> {
  url: string;
  sortFunc: SortFunction<T>;
  /* This type here should be `T`, but the compiler can't properly 
       infer types when returning a collection from tableNameToCollection */
  formatItem: (item: any) => {
    inputLabel?: boolean;
    label?: string;
    icon?: string;
    text: string;
  };
  envFilter?: (item: T, envId: string) => boolean;
  initialFilters?: F;
}

interface Paginated<T> {
  page: number;
  per_page: number;
  num_total: number;
  items: T[];
}

export function createCollection<T extends CollectionItem<K>, F = null, K = string>(
  opts: CreateCollectionOptions<T, F>
) {
  const state = reactive({
    ready: false,
    loading: true,
    loadingProgress: 0.0,
    items: new Map<K, T>(),
    error: undefined as any,
    filters: opts.initialFilters || {},
  });

  const ready = computed(() => state.ready);
  const loading = computed(() => state.loading);
  const loadingProgress = computed(() => state.loadingProgress);
  const loadingPercent = computed(() => Math.ceil(state.loadingProgress * 100));
  const status = computed(() => (state.error ? `${state.error}` : null));
  const getOne = computed(() => (id: K) => state.items.get(id) as T);

  const all = computed(() => {
    const items = Array.from(state.items.values());
    items.sort(opts.sortFunc);
    return items;
  });

  const allForEnv = computed(
    () => (envId: string) =>
      opts.envFilter ? all.value.filter((item) => opts.envFilter!(item, envId)) : all.value
  );

  const setOne = (item: T) => {
    state.items.set(item.id, item);
  };

  const discardOne = (id: K) => {
    state.items.delete(id);
  };

  const readAllItems = async () => {
    state.loading = true;
    state.loadingProgress = 0;
    try {
      let page = 1;
      let num_pages = 1;
      do {
        const res: AxiosResponse<Paginated<T>> = await axios.get(opts.url, {
          params: {
            page,
            ...state.filters,
          },
        });
        for (const item of res.data.items) {
          setOne(item);
        }
        page++;
        num_pages = Math.ceil(res.data.num_total / res.data.per_page);
        state.loadingProgress = page / (num_pages || 1);
      } while (page <= num_pages);
      state.loadingProgress = 1;
      state.ready = true;
    } catch (error) {
      state.error = error;
    }
    state.loading = false;
  };

  const readItem = async ({ id }: { id: string }) => {
    try {
      const res = await axios.get(`${opts.url}/${id}`);
      const item = res.data as T;
      setOne(item);
    } catch (error) {
      state.error = error;
    }
  };

  const createItem = async (item: Record<string, any>): Promise<T> => {
    const res = await axios.post(opts.url, item);
    return res.data as T;
  };

  const updateItem = async ({
    id,
    data,
  }: {
    id: string;
    data: Record<string, any>;
  }): Promise<T> => {
    const res = await axios.put(`${opts.url}/${id}`, data);
    return res.data as T;
  };

  const deleteItem = async (id: string): Promise<void> => {
    await axios.delete(`${opts.url}/${id}`);
  };

  const setFilters = (filters: F) => {
    state.filters = filters || {};
    readAllItems();
  };

  const reset = () => {
    state.ready = false;
    state.items = new Map();
    state.error = undefined;
  };

  return reactive({
    state: readonly(state),
    ready,
    loading,
    loadingProgress,
    loadingPercent,
    status,
    getOne,
    all,
    allForEnv,
    setOne,
    discardOne,
    readAllItems,
    readItem,
    createItem,
    updateItem,
    deleteItem,
    setFilters,
    reset,
    formatItem: opts.formatItem,
  });
}
