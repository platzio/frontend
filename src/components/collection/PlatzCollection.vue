<template>
  <div v-if="hasItems && hasGlobalActions" class="mb-4 text-end">
    <slot name="globalActions" />
  </div>

  <div v-if="loading" class="my-3 text-center text-body-secondary">
    <FaIcon icon="circle-notch" spin fixed-width />
  </div>

  <ul v-else class="list-group" :class="{ 'list-group-flush': flush }">
    <template v-for="item in items" :key="item.id">
      <slot name="item" class="list-group-item" :item="item">
        {{ item }}
      </slot>
    </template>

    <li v-if="!hasItems" class="list-group-item py-5">
      <slot name="empty">
        <div class="text-center">
          <h1>😢</h1>
          <h2 class="my-2">
            <slot name="emptyTitle">Nothing Here</slot>
          </h2>
          <div class="my-2">
            <slot name="emptyText" />
          </div>
          <div class="my-4">
            <slot name="emptyAction" />
          </div>
        </div>
      </slot>
    </li>
  </ul>
</template>

<script setup lang="ts" generic="Item extends CollectionItem">
import { computed } from "vue";
import { type CollectionItem } from "@/store/models/collection";

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    items: Array<Item>;
    flush?: boolean;
  }>(),
  {
    loading: false,
    flush: false,
  }
);

const slots = defineSlots<{
  globalActions(): any;
  item({ item }: { item: Item }): any;
  empty(): any;
  emptyTitle(): any;
  emptyText(): any;
  emptyAction(): any;
}>();

const hasItems = computed(() => props.items.length > 0);
const hasGlobalActions = computed(() => slots && Boolean(slots.globalActions));
</script>
