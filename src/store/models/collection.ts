import { computed, reactive, readonly } from "vue";
import axios, { AxiosResponse } from "axios";
import { cloneDeep } from "lodash";

export interface CollectionItem<ID = string> {
    id: ID;
}

type SortFunction<Item> = (x: Item, y: Item) => number;
export type CollectionFilters = Record<string, string | number | boolean>;

export interface CreateCollectionOptions<Item> {
    url: string;
    sortFunc: SortFunction<Item>;
    /* This type here should be `Item`, but the compiler can't properly
       infer types when returning a collection from tableNameToCollection */
    formatItem: (item: Item) => {
        inputLabel?: boolean;
        label?: string;
        icon?: string;
        text: string;
    };
    envFilter?: (item: Item, envId: string) => boolean;
    initialFilters?: CollectionFilters;
}

interface Paginated<Item> {
    page: number;
    per_page: number;
    num_total: number;
    items: Item[];
}

export function createCollection<
    Item extends CollectionItem<K>,
    CreateItem,
    CreatedItem,
    UpdateItem,
    K = string
>(opts: CreateCollectionOptions<Item>) {
    const state = reactive({
        ready: false,
        loading: true,
        loadingProgress: 0.0,
        items: new Map<K, Item>(),
        error: undefined as any,
        appliedFilters: new Set<string>(),
    });

    const ready = computed(() => state.ready);
    const loading = computed(() => state.loading);
    const loadingProgress = computed(() => state.loadingProgress);
    const loadingPercent = computed(() =>
        Math.ceil(state.loadingProgress * 100)
    );
    const status = computed(() => (state.error ? `${state.error}` : null));
    const getOne = computed(() => (id: K) => state.items.get(id) as Item);

    const all = computed(() => {
        const items = Array.from(state.items.values());
        items.sort(opts.sortFunc);
        return items;
    });

    const allForEnv = computed(
        () => (envId: string) =>
            opts.envFilter
                ? all.value.filter((item) => opts.envFilter!(item, envId))
                : all.value
    );

    const setOne = (item: Item) => {
        state.items.set(item.id, item);
    };

    const discardOne = (id: K) => {
        state.items.delete(id);
    };

    const readAllItems = async (filters: CollectionFilters) => {
        state.loading = true;
        state.error = null;
        state.loadingProgress = 0;
        try {
            let page = 1;
            let num_pages = 1;
            do {
                const res: AxiosResponse<Paginated<Item>> = await axios.get(
                    opts.url,
                    {
                        params: {
                            page,
                            ...filters,
                        },
                    }
                );
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
            const item = res.data as Item;
            setOne(item);
        } catch (error) {
            state.error = error;
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
        id: K;
        data: UpdateItem;
    }): Promise<Item> => {
        const res = await axios.put(`${opts.url}/${id}`, data);
        return res.data as Item;
    };

    const deleteItem = async (id: K): Promise<void> => {
        await axios.delete(`${opts.url}/${id}`);
    };

    const setFilters = async (f: CollectionFilters) => {
        const filters = cloneDeep(f);
        const filtersKey = Object.entries(filters)
            .sort()
            .map(([k, v]) => `${k}=${v}`)
            .join(",");
        if (state.appliedFilters.has(filtersKey)) {
            return;
        }
        state.appliedFilters.add(filtersKey);
        await readAllItems(filters);
    };

    const init = () => {
        setFilters(opts.initialFilters || {});
    };

    const reset = () => {
        state.ready = false;
        state.items = new Map();
        state.appliedFilters = new Set();
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
