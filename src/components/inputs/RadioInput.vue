<template>
  <div>
    <label class="opacity-100">
      <span class="opacity-50">{{ input.label }}</span>
      <span class="ms-2 text-danger" v-if="input.required">*</span>
    </label>
    <div class="alert alert-warning" v-if="!input.options">
      Input of type RadioSelect must have an options field.
    </div>
    <div
      class="my-2 form-check"
      v-else
      v-for="option in input.options"
      :key="option.value"
    >
      <input
        type="radio"
        class="form-check-input"
        v-model="inner"
        :name="input.id"
        :id="`${input.id}${option.value}`"
        :value="option.value"
        :disabled="disabled"
        :required="input.required"
      />
      <label class="form-check-label" :for="`${input.id}${option.value}`">
        <div>
          {{ option.label || option.value }}
        </div>
        <div v-if="option.helpText" class="small opacity-50">
          {{ option.helpText }}
        </div>
      </label>
      <div class="form-text" v-if="input.helpText">
        {{ input.helpText }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { isEqual } from "lodash";
import { defineComponent, ref, watch, PropType, watchEffect } from "vue";
import { HelmChartUiInput } from "@/store/models/helm-chart";

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
    input: {
      type: Object as PropType<HelmChartUiInput>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    modelValue: {},
    allValues: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },

  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const inner = ref();

    watch(
      () => props.modelValue,
      (newValue) => {
        if (isEqual(newValue, inner.value)) {
          return;
        }
        inner.value = newValue;
      },
      { immediate: true, deep: true }
    );

    watchEffect(() => {
      emit("update:modelValue", inner.value);
    });

    return {
      inner,
    };
  },
});
</script>
