<template>
  <div v-if="formattedItem">
    <span v-if="showLabel && formattedItem.inputLabel" class="text-secondary">
      {{ input.label }}:
    </span>
    <span v-else-if="showLabel && formattedItem.label" class="text-secondary">
      {{ formattedItem.label }}:
    </span>
    <span
      :class="{
        'text-secondary': !formattedItem.label && !formattedItem.inputLabel,
      }"
    >
      <fa v-if="formattedItem.icon" :icon="formattedItem.icon" fixed-width />
      {{ formattedItem.text }}
    </span>
  </div>
  <div v-else-if="showEmpty" class="d-flex flex-row">
    <div v-if="showLabel" class="me-1">{{ input.label }}:</div>
    <div class="text-secondary fst-italic">(empty)</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "@vue/runtime-core";
import { HelmChartUiInput } from "@/store/models/helm-chart";
import { useStore } from "@/store";
import { TableName } from "@/store/collections";

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<HelmChartUiInput>,
      required: true,
    },
    value: {
      type: String,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    showEmpty: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const store = useStore();

    const collection = computed(() =>
      props.input.collection
        ? store!.tableNameToCollection(props.input.collection as TableName)
        : null
    );

    const item = computed(() =>
      collection.value && props.value
        ? collection.value.getOne(props.value)
        : null
    );

    const formattedItem = computed(() =>
      collection.value && item.value
        ? collection.value.formatItem(item.value)
        : null
    );

    return {
      item,
      formattedItem,
    };
  },
});
</script>