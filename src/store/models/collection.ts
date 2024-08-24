import { computed, reactive, readonly, ref } from "vue";
import axios, { type AxiosResponse } from "axios";
import { cloneDeep } from "lodash";

type SortFunction<Item> = (x: Item, y: Item) => number;

type FormatFunction<Item> = (item: Item) => {
  inputLabel: boolean;
  label?: string;
  icon?: string;
  text: string;
};

type EnvFilter<Item> = (item: Item, envId: string) => boolean;

export type CollectionFilters = Record<string, string | number | boolean>;

export interface CreateCollectionOptions<Item> {
  url: string;
  sortFunc: SortFunction<Item>;
  formatItem: FormatFunction<Item>;
  envFilter?: EnvFilter<Item>;
  initialFilters?: CollectionFilters;
}

export interface Paginated<Item> {
  page: number;
  per_page: number;
  num_total: number;
  items: Item[];
}

export interface CollectionItem<ID = string> {
  id: ID;
}

export function createCollection<
  Item extends CollectionItem<ID>,
  CreateItem,
  CreatedItem,
  UpdateItem,
  ID = string
>(opts: CreateCollectionOptions<Item>) {
  const ready = ref(false);
  const loading = ref(true);
  const loadingProgress = ref(0.0);
  const items = ref<Map<ID, Item>>();
  const error = ref<any>(undefined);
  const appliedFilters = ref(new Set<string>());

  const loadingPercent = computed(() => Math.ceil(loadingProgress.value * 100));
  const status = computed(() => error.value?.toString());
  const getOne = computed(() => (id: ID) => items.value?.get(id));

  const all = computed(() => {
    if (!items.value) {
      return [];
    }
    const result = Array.from(items.value.values());
    result.sort(opts.sortFunc);
    return result;
  });

  const allForEnv = computed(
    () => (envId: string) =>
      opts.envFilter
        ? all.value.filter((item) => opts.envFilter!(item, envId))
        : all.value
  );

  const setOne = (item: Item) => {
    items.value?.set(item.id, item);
  };

  const discardOne = (id: ID) => {
    items.value?.delete(id);
  };

  const fetchPage = async (
    page: number,
    filters?: CollectionFilters
  ): Promise<Paginated<Item>> => {
    const res: AxiosResponse<Paginated<Item>> = await axios.get(opts.url, {
      params: {
        page,
        ...filters,
      },
    });
    return res.data;
  };

  const readAllItems = async (filters: CollectionFilters) => {
    loading.value = true;
    error.value = null;
    loadingProgress.value = 0;
    try {
      let page_num = 1;
      let num_pages = 1;
      do {
        const cur_page = await fetchPage(page_num, filters);
        for (const item of cur_page.items) {
          setOne(item);
        }
        page_num++;
        num_pages = Math.ceil(cur_page.num_total / cur_page.per_page);
        loadingProgress.value = page_num / (num_pages || 1);
      } while (page_num <= num_pages);
      loadingProgress.value = 1;
      ready.value = true;
    } catch (err) {
      error.value = err;
    }
    loading.value = false;
  };

  const readItem = async ({ id }: { id: string }) => {
    try {
      const res = await axios.get(`${opts.url}/${id}`);
      const item = res.data;
      setOne(item);
    } catch (err) {
      error.value = err;
    }
  };

  const createItem = async (item: CreateItem): Promise<CreatedItem> => {
    const res = await axios.post(opts.url, item);
    return res.data as CreatedItem;
  };

  const updateItem = async ({
    id,
    data,
  }: {
    id: ID;
    data: UpdateItem;
  }): Promise<Item> => {
    const res = await axios.put(`${opts.url}/${id}`, data);
    return res.data;
  };

  const deleteItem = async (id: ID): Promise<void> => {
    await axios.delete(`${opts.url}/${id}`);
  };

  const setFilters = async (f: CollectionFilters) => {
    const filters = cloneDeep(f);
    const filtersKey = Object.entries(filters)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join(",");
    if (appliedFilters.value.has(filtersKey)) {
      return;
    }
    appliedFilters.value.add(filtersKey);
    await readAllItems(filters);
  };

  const reset = () => {
    ready.value = false;
    items.value = new Map();
    appliedFilters.value = new Set();
    error.value = undefined;
  };

  const init = () => {
    reset();
    setFilters(opts.initialFilters || {});
  };

  return reactive({
    ready: readonly(ready),
    loading: readonly(loading),
    loadingProgress: readonly(loadingProgress),
    items: readonly(items),
    error: readonly(error),
    appliedFilters: readonly(appliedFilters),
    loadingPercent,
    status,
    getOne,
    fetchPage,
    all,
    allForEnv,
    init,
    setOne,
    discardOne,
    readItem,
    createItem,
    updateItem,
    deleteItem,
    setFilters,
    reset,
    formatItem: opts.formatItem,
  });
}
