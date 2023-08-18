<template>
    <div>
        <div class="card-header">
            <PlatzPagination
                @changed="loadPage"
                :page-query-param="pageQueryParam"
                :page-size="cur_page?.per_page"
                :total-items="cur_page?.num_total"
            />
        </div>

        <PlatzError :error="error" />

        <div :class="{ 'opacity-50': loading }">
            <PlatzCollection
                :loading="!cur_page"
                :items="cur_page?.items"
                :flush="true"
            >
                <template v-for="(_idx, name) in $slots" v-slot:[name]="data">
                    <slot :name="name" v-bind="data"></slot>
                </template>
            </PlatzCollection>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { CollectionItem, Paginated } from "@/store/models/collection";
import PlatzCollection from "./PlatzCollection.vue";
import PlatzPagination from "./PlatzPagination.vue";
import PlatzError from "../base/PlatzError.vue";

export type GetPageFunction = (
    page: number
) => Promise<Paginated<CollectionItem>>;

export default defineComponent({
    components: {
        PlatzCollection,
        PlatzPagination,
        PlatzError,
    },

    props: {
        pageQueryParam: {
            type: String,
            required: false,
        },
        getPage: {
            type: Function as PropType<GetPageFunction>,
            required: true,
        },
    },

    setup(props) {
        const loading = ref<boolean>(true);
        const error = ref<any>(null);
        const cur_page = ref<Paginated<CollectionItem> | null>(null);

        const loadPage = async (page: number) => {
            loading.value = true;
            try {
                cur_page.value = await props.getPage(page);
            } catch (err) {
                error.value = err;
            }
            loading.value = false;
        };

        return {
            loading,
            loadPage,
            cur_page,
            error,
        };
    },
});
</script>
