<template>
  <div v-if="(value && value.length) || showEmpty">
    <div v-if="showLabel && input.label" class="text-secondary">
      {{ input.label }}
    </div>
    <ul v-if="value" class="array-value-list">
      <li v-for="(item, idx) in value" :key="idx">
        <ArraySingleValue
          v-if="innerInput"
          :input="innerInput"
          :env-id="envId"
          :value="item"
          :all-values="allValues"
        />
        <div v-else class="text-danger">Array has no item type</div>
      </li>
    </ul>
    <span v-else class="text-secondary fst-italic">(empty)</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type UiSchemaInput } from "@platzio/sdk";
import ArraySingleValue from "./ArraySingleValue.vue";

const props = withDefaults(
  defineProps<{
    envId: string;
    input: UiSchemaInput;
    value?: Array<any>;
    allValues: Record<string, any>;
    showLabel?: boolean;
    showEmpty?: boolean;
  }>(),
  {
    value: undefined,
    withLabel: true,
    showEmpty: false,
  }
);

const innerInput = computed<UiSchemaInput | undefined>(() =>
  props.input.itemType
    ? {
        ...props.input,
        type: props.input.itemType,
        label: "",
      }
    : undefined
);
</script>

<style lang="scss" scoped>
ul.array-value-list {
  margin: 0;
  padding-left: 1.25rem;

  li {
    margin: 0;
    padding: 0;
  }
}
</style>
