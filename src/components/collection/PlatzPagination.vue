<template>
  <div
    class="my-1 d-flex flex-row align-items-baseline justify-content-between"
  >
    <div
      v-if="totalItems !== undefined"
      class="d-inline-flex flex-row placeholder-glow"
    >
      <div>Total&nbsp;</div>
      <div class="fw-bolder">{{ totalItems }}</div>
    </div>
    <div v-else class="my-2 rounded placeholder placeholder-glow col-1" />

    <nav v-if="totalItems !== undefined && pageSize !== undefined">
      <ul class="pagination pagination-sm m-0">
        <li class="page-item" :class="{ disabled: cur_page <= FIRST }">
          <a class="page-link px-3" @click="setPrevPage()">
            <FaIcon icon="chevron-left" />
          </a>
        </li>
        <li
          v-for="(link, i) in page_links"
          :key="i"
          class="page-item"
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
          <span v-if="link.type == 'separator'" class="px-2 text-secondary">
            . . .
          </span>
        </li>
        <li class="page-item" :class="{ disabled: cur_page >= last_page }">
          <a class="page-link px-3" @click="setNextPage()">
            <FaIcon icon="chevron-right" />
          </a>
        </li>
      </ul>
    </nav>
    <div v-else class="my-2 rounded placeholder placeholder-glow col-2" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const FIRST = 1;
const AROUND = 3;

type NavLink = { type: "separator" } | { type: "page"; page: number };

const props = withDefaults(
  defineProps<{
    pageQueryParam?: string;
    totalItems?: number;
    pageSize?: number;
  }>(),
  {
    pageQueryParam: "page",
    totalItems: undefined,
    pageSize: undefined,
  }
);

const emit = defineEmits(["changed"]);

const route = useRoute();
const router = useRouter();

const cur_page = ref<number>(
  parseInt(route.query[props.pageQueryParam]?.toString() || FIRST.toString()) ||
    FIRST
);

const last_page = computed(() => {
  if (props.totalItems === undefined || props.pageSize === undefined) {
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
  }
  if (head > AROUND + 1) {
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

  if (tail > AROUND + 1) {
    result.push({ type: "separator" });
  }
  if (tail > AROUND) {
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
</script>
