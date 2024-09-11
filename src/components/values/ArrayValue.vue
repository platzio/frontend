<template>
  <div v-if="(value && value.length) || showEmpty">
    <div class="text-secondary" v-if="showLabel && input.label">
      {{ input.label }}
    </div>
    <ul class="array-value-list" v-if="value">
      <li v-for="(item, idx) in value" :key="idx">
        <SingleConfigValue
          v-if="innerInput"
          :input="innerInput"
          :envId="envId"
          :value="item"
          :allValues="allValues"
        />
        <div v-else class="text-danger">Array has no item type</div>
      </li>
    </ul>
    <span class="text-secondary fst-italic" v-else>(empty)</span>
  </div>
</template>

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

<script setup lang="ts">
import { computed } from "vue";
import { type UiSchemaInput } from "@platzio/sdk";
import SingleConfigValue from "./SingleConfigValue.vue";

const props = withDefaults(
  defineProps<{
    envId: string;
    input: UiSchemaInput;
    value: Array<any>;
    allValues: Record<string, any>;
    showLabel?: boolean;
    showEmpty?: boolean;
  }>(),
  { withLabel: true, showEmpty: false }
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
