<template>
  <div v-if="visible" class="mb-3">
    <CheckboxInput
      v-if="input && input.type === 'Checkbox'"
      v-model="inner"
      :input="input"
      :env-id="envId"
      :disabled="disabled"
      :all-values="allValues"
      :is-new="isNew"
    />
    <CollectionInput
      v-else-if="input && input.type === 'CollectionSelect'"
      v-model="inner"
      :input="input"
      :env-id="envId"
      :disabled="disabled"
      :all-values="allValues"
      :is-new="isNew"
    />
    <DaysHourInput
      v-else-if="input && input.type === 'DaysAndHour'"
      v-model="inner"
      :input="input"
      :env-id="envId"
      :disabled="disabled"
      :all-values="allValues"
      :is-new="isNew"
    />
    <NumberInput
      v-else-if="input && input.type === 'number'"
      v-model="inner"
      :input="input"
      :env-id="envId"
      :disabled="disabled"
      :all-values="allValues"
      :is-new="isNew"
    />
    <RadioInput
      v-else-if="input && input.type === 'RadioSelect'"
      v-model="inner"
      :input="input"
      :env-id="envId"
      :disabled="disabled"
      :all-values="allValues"
      :is-new="isNew"
    />
    <TextInput
      v-else-if="input && input.type === 'text'"
      v-model="inner"
      :input="input"
      :env-id="envId"
      :disabled="disabled"
      :all-values="allValues"
      :is-new="isNew"
    />
    <div v-else class="alert alert-warning mb-3">
      Oh no, I don't know how to render this: {{ input }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { isEqual } from "lodash";
import JsonLogic from "json-logic-js";
import { type UiSchemaInput } from "@platzio/sdk";
import CheckboxInput from "./CheckboxInput.vue";
import CollectionInput from "./CollectionInput.vue";
import DaysHourInput from "./DaysHourInput.vue";
import NumberInput from "./NumberInput.vue";
import RadioInput from "./RadioInput.vue";
import TextInput from "./TextInput.vue";

const props = withDefaults(
  defineProps<{
    envId: string;
    input?: UiSchemaInput;
    disabled: boolean;
    modelValue?: any;
    allValues: Record<string, any>;
    isNew?: boolean;
  }>(),
  {
    disabled: false,
    isNew: true,
  }
);

const emit = defineEmits(["update:modelValue"]);

const inner = ref();

watch(
  () => props.modelValue,
  (newvalue, oldvalue) => {
    if (isEqual(newvalue, oldvalue)) {
      return;
    }
    inner.value = newvalue;
  },
  { immediate: true, deep: true }
);

watch(
  () => inner,
  () => {
    emit("update:modelValue", inner.value);
  },
  { deep: true }
);

const visible = computed(() => {
  if (props.input?.showIf) {
    // Keeping the behavior of the rust code in chart-ext/ui_schema.rs, in which only if the
    // json logic is valid and translates to true, the field is displayed
    try {
      return JsonLogic.apply(props.input.showIf, props.allValues) === true;
    } catch {
      return false;
    }
  }
  if (props.input?.showIfAll) {
    return props.input.showIfAll.every(
      (fv) => props.allValues[fv.field] === fv.value
    );
  }
  return true;
});
</script>
