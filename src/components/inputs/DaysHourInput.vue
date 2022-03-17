<template>
  <div class="card">
    <div class="card-body px-3 py-2">
      <div class="mb-1 small">
        <span class="opacity-50">{{ input.label }}</span>
        <span class="ms-2 text-danger" v-if="input.required">*</span>
      </div>
      <div class="d-flex flex-row align-items-center">
        <div
          class="form-check form-check-inline"
          v-for="(day_name, idx) in DAY_NAMES"
          :key="idx"
        >
          <input
            class="form-check-input"
            type="checkbox"
            :id="`${input.id}-${idx}`"
            v-model="inner.days[idx]"
          />
          <label class="form-check-label" :for="`${input.id}-${idx}`">
            {{ day_name }}
          </label>
        </div>
        <div class="flex-fill mx-2"></div>
        <select class="form-select" v-model="inner.hour">
          <option v-for="i in 24" :key="i - 1" :value="padNum(i - 1)">
            {{ padNum(i - 1) }}
          </option>
        </select>
        <div class="flex-fill mx-1">:</div>
        <select class="form-select" v-model="inner.minute">
          <option v-for="i in 60" :key="i - 1" :value="padNum(i - 1)">
            {{ padNum(i - 1) }}
          </option>
        </select>
        <div class="ms-2 small text-secondary">UTC</div>
      </div>
      <div class="form-text" v-if="input.helpText">
        {{ input.helpText }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { isEqual } from "lodash";
import { defineComponent, ref, watch, PropType } from "vue";
import { HelmChartUiInput } from "@/store/chart-ext";

const DAY_NAMES: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

const initialDays = (): Record<number, boolean> => ({
  0: false,
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
});

const initialValue = () => ({
  days: initialDays(),
  hour: "23",
  minute: "15",
});

export interface ExternalFormat {
  run_days?: string;
  schedule?: string;
}

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
    modelValue: {
      type: Object as PropType<ExternalFormat>,
    },
    allValues: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },

  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const inner = ref(initialValue());

    watch(
      () => props.modelValue,
      (newValue) => {
        if (!newValue) {
          inner.value = initialValue();
          return;
        }
        const newInner = initialValue();
        if (newValue.run_days) {
          for (const idx of newValue.run_days.split(",")) {
            const num = parseInt(idx);
            if (newInner.days[num] !== undefined) {
              newInner.days[num] = true;
            }
          }
        }
        if (newValue.schedule) {
          const [hour, minute] = newValue.schedule.split(":", 2);
          if (hour && minute) {
            newInner.hour = hour;
            newInner.minute = minute;
          }
        }
        if (isEqual(newInner, inner.value)) {
          return;
        }
        inner.value = newInner;
      },
      { immediate: true, deep: true }
    );

    watch(
      inner,
      (newInner) => {
        const rendered = {
          run_days: Object.entries(newInner.days)
            .filter(([day, is_enabled]) => is_enabled)
            .map(([day, is_enabled]) => day)
            .join(","),
          schedule: `${newInner.hour}:${newInner.minute}`,
        };
        emit("update:modelValue", rendered);
      },
      { deep: true }
    );

    const padNum = (num: number) => num.toString().padStart(2, "0");

    return {
      DAY_NAMES,
      inner,
      padNum,
    };
  },
});
</script>
