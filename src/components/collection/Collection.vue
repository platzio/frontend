<template>
  <div class="mb-4 text-end" v-if="hasItems && hasGlobalActions">
    <slot name="global-actions" />
  </div>

  <ul class="list-group" :class="{ 'list-group-flush': flush }">
    <slot
      name="item"
      class="list-group-item"
      v-for="item in items"
      :key="item.id"
      :item="item"
    >
      {{ item }}
    </slot>

    <li class="list-group-item py-5" v-if="!hasItems">
      <slot name="empty">
        <div class="text-center">
          <h1>😢</h1>
          <h2 class="my-2">
            <slot name="empty-title">Nothing Here</slot>
          </h2>
          <div class="my-2">
            <slot name="empty-text" />
          </div>
          <div class="my-4">
            <slot name="empty-action" />
          </div>
        </div>
      </slot>
    </li>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { CollectionItem } from "@/store/models/collection";

export default defineComponent({
  props: {
    items: {
      type: Object as PropType<Array<CollectionItem>>,
      required: true
    },
    flush: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { slots }) {
    const hasItems = computed(() => props.items && props.items.length > 0);
    const hasGlobalActions = computed(() => !!slots["global-actions"]);

    return {
      hasItems,
      hasGlobalActions
    };
  }
});
</script>
