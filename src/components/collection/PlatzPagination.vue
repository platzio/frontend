<template>
    <div
        class="my-1 d-flex flex-row align-items-baseline justify-content-between"
    >
        <div class="d-inline-flex flex-row placeholder-glow">
            <div>Total&nbsp;</div>
            <div v-if="totalItems !== undefined" class="fw-bolder">
                {{ totalItems }}
            </div>
            <div v-else class="rounded placeholder my-1 col-12" />
        </div>

        <nav>
            <ul class="pagination pagination-sm m-0">
                <li class="page-item" :class="{ disabled: cur_page <= FIRST }">
                    <a class="page-link px-3" @click="setPrevPage()">
                        <FaIcon icon="chevron-left" />
                    </a>
                </li>
                <li
                    class="page-item"
                    v-for="(link, i) in page_links"
                    :key="i"
                    :class="{
                        active: link.type == 'page' && cur_page == link.page,
                    }"
                >
                    <a
                        v-if="link.type == 'page'"
                        class="page-link px-3"
                        @click="setPage(link.page)"
                    >
                        {{ link.page }}
                    </a>
                    <span
                        v-if="link.type == 'separator'"
                        class="px-2 text-secondary"
                    >
                        . . .
                    </span>
                </li>
                <li
                    class="page-item"
                    :class="{ disabled: cur_page >= last_page }"
                >
                    <a class="page-link px-3" @click="setNextPage()">
                        <FaIcon icon="chevron-right" />
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const FIRST = 1;
const AROUND = 3;

type NavLink = { type: "separator" } | { type: "page"; page: number };

export default defineComponent({
    props: {
        pageQueryParam: {
            type: String,
            default: "page",
        },
        totalItems: {
            type: Number,
            required: false,
        },
        pageSize: {
            type: Number,
            required: false,
        },
    },

    emits: ["changed"],

    setup(props, { emit }) {
        const route = useRoute();
        const router = useRouter();

        const cur_page = ref<number>(
            parseInt(
                route.query[props.pageQueryParam]?.toString() ||
                    FIRST.toString()
            ) || FIRST
        );

        const last_page = computed(() => {
            if (
                props.totalItems === undefined ||
                props.pageSize === undefined
            ) {
                return 0;
            }
            return Math.ceil(props.totalItems / props.pageSize);
        });

        const page_links = computed((): NavLink[] => {
            const result: NavLink[] = [];

            const head = cur_page.value - FIRST;
            const tail = last_page.value - cur_page.value;

            if (head > AROUND) {
                result.push({ type: "page", page: 1 });
                result.push({ type: "separator" });
            }

            for (
                let i = Math.min(head, AROUND * 2 - Math.min(tail, AROUND));
                i > 0;
                i--
            ) {
                result.push({ type: "page", page: cur_page.value - i });
            }

            result.push({ type: "page", page: cur_page.value });

            for (
                let i = 1;
                i <= Math.min(tail, AROUND * 2 - Math.min(head, AROUND));
                i++
            ) {
                result.push({ type: "page", page: cur_page.value + i });
            }

            if (tail > AROUND) {
                result.push({ type: "separator" });
                result.push({ type: "page", page: last_page.value });
            }

            return result;
        });

        const setPage = (new_page: number) => {
            cur_page.value = Math.max(new_page, 1);
            router.replace({ query: { page: cur_page.value } });
            emit("changed", cur_page.value);
        };

        const setPrevPage = () => setPage(cur_page.value - 1);
        const setNextPage = () => setPage(cur_page.value + 1);

        onMounted(() => {
            emit("changed", cur_page.value);
        });

        return {
            FIRST,
            cur_page,
            last_page,
            page_links,
            setPage,
            setPrevPage,
            setNextPage,
        };
    },
});
</script>
