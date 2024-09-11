<template>
  <div v-if="input && (shouldDisplay || showEmpty)">
    <PlainValue
      v-if="input.type === 'text'"
      :input="input"
      :value="value"
      :showLabel="showLabel"
      :showEmpty="showEmpty"
    />
    <PlainValue
      v-else-if="input.type === 'number'"
      :input="input"
      :value="value"
      :showLabel="showLabel"
      :showEmpty="showEmpty"
    />
    <CheckboxValue
      v-else-if="input.type === 'Checkbox'"
      :input="input"
      :value="value"
      :showLabel="showLabel"
      :showEmpty="showEmpty"
    />
    <CollectionValue
      v-else-if="input.type === 'CollectionSelect'"
      :input="input"
      :value="value"
      :envId="envId"
      :showLabel="showLabel"
      :showEmpty="showEmpty"
    />
    <RadioValue
      v-else-if="input.type === 'RadioSelect'"
      :input="input"
      :value="value"
      :showLabel="showLabel"
      :showEmpty="showEmpty"
    />
    <DaysHourValue
      v-else-if="input.type === 'DaysAndHour'"
      :input="input"
      :value="value"
      :showLabel="showLabel"
      :showEmpty="showEmpty"
    />
    <div v-else>
      <span class="text-secondary me-2">{{ input.label }}:</span>
      <span class="text-danger">
        <FaIcon icon="exclamation-triangle" /> I don't know how to render
        {{ input.type }}
        fields
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type UiSchemaInput } from "@platzio/sdk";
import JsonLogic from "json-logic-js";
import CheckboxValue from "./CheckboxValue.vue";
import CollectionValue from "./CollectionValue.vue";
import DaysHourValue from "./DaysHourValue.vue";
import RadioValue from "./RadioValue.vue";
import PlainValue from "./PlainValue.vue";

const props = withDefaults(
  defineProps<{
    envId: string;
    input: UiSchemaInput;
    value: any;
    allValues: Record<string, any>;
    showLabel?: boolean;
    showEmpty?: boolean;
  }>(),
  { showLabel: true, showEmpty: false }
);

const shouldDisplay = computed(() => {
  if (!props.input) {
    return false;
  }

  if (props.input.showIf) {
    // Keeping the behavior of the rust code in chart-ext/ui_schema.rs, in which only if the
    // json logic is valid and translates to true, the field is displayed
    try {
      return JsonLogic.apply(props.input.showIf, props.allValues) === true;
    } catch {
      return false;
    }
  } else if (props.input.showIfAll != undefined) {
    return props.input.showIfAll.every(
      (fv) => props.allValues[fv.field] === fv.value
    );
  } else {
    return true;
  }
});
</script>
