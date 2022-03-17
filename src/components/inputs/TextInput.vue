<template>
  <div class="form-floating">
    <input
      type="text"
      class="form-control"
      :id="input.id"
      v-model="inner"
      :disabled="disabled"
      :required="required"
    />
    <label class="opacity-100">
      <span class="opacity-50">{{ input.label }}</span>
      <span class="ms-2 text-danger" v-if="required">*</span>
    </label>
    <div class="form-text" v-if="input.helpText">
      {{ input.helpText }}
    </div>
  </div>
</template>

<script lang="ts">
import { isEqual } from "lodash";
import {
  defineComponent,
  ref,
  watch,
  watchEffect,
  PropType,
  computed,
} from "vue";
import { HelmChartUiInput } from "@/store/chart-ext";

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
    isNew: {
      type: Boolean,
      default: true,
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

    const required = computed(
      () =>
        props.input.required &&
        (!props.input.sensitive || (props.input.sensitive && !props.isNew))
    );

    return {
      inner,
      required,
    };
  },
});
</script>
