<template>
  <div>
    <div class="card-header">
      <PlatzPagination
        :page-query-param="pageQueryParam"
        :page-size="cur_page?.per_page"
        :total-items="cur_page?.num_total"
        @changed="loadPage"
      />
    </div>

    <PlatzError :error="error" />

    <div :class="{ 'opacity-50': loading }">
      <PlatzCollection
        :loading="!cur_page"
        :items="cur_page?.items || []"
        :flush="true"
      >
        <template v-for="(_, name) in slots" #[name]="data">
          <slot v-if="data" :name="name" v-bind="data" />
        </template>
      </PlatzCollection>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Item extends CollectionItem">
import { ref } from "vue";
import { type CollectionItem, type Paginated } from "@/store/models/collection";
import PlatzCollection from "./PlatzCollection.vue";
import PlatzPagination from "./PlatzPagination.vue";
import PlatzError from "../base/PlatzError.vue";

const props = defineProps<{
  pageQueryParam?: string;
  getPage: (page: number) => Promise<Paginated<Item>>;
}>();

const slots = defineSlots<{
  globalActions(): any;
  item({ item }: { item: Item }): any;
  empty(): any;
  emptyTitle(): any;
  emptyText(): any;
  emptyAction(): any;
}>();

const loading = ref(true);
const error = ref<any>(undefined);
const cur_page = ref<Paginated<Item>>();

const loadPage = async (page: number) => {
  loading.value = true;
  try {
    cur_page.value = await props.getPage(page);
  } catch (err) {
    error.value = err;
  }
  loading.value = false;
};
</script>
