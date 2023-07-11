<template>
    <div v-if="visible" class="mb-3">
        <ArrayInput
            v-if="input.type === 'array'"
            :input="input"
            v-model="inner"
            :envId="envId"
            :disabled="disabled"
            :allValues="allValues"
            :isNew="isNew"
        />
        <CheckboxInput
            v-else-if="input.type === 'Checkbox'"
            :input="input"
            v-model="inner"
            :envId="envId"
            :disabled="disabled"
            :allValues="allValues"
            :isNew="isNew"
        />
        <CollectionInput
            v-else-if="input.type === 'CollectionSelect'"
            :input="input"
            v-model="inner"
            :envId="envId"
            :disabled="disabled"
            :allValues="allValues"
            :isNew="isNew"
        />
        <DaysHourInput
            v-else-if="input.type === 'DaysAndHour'"
            :input="input"
            v-model="inner"
            :envId="envId"
            :disabled="disabled"
            :allValues="allValues"
            :isNew="isNew"
        />
        <NumberInput
            v-else-if="input.type === 'number'"
            :input="input"
            v-model="inner"
            :envId="envId"
            :disabled="disabled"
            :allValues="allValues"
            :isNew="isNew"
        />
        <RadioInput
            v-else-if="input.type === 'RadioSelect'"
            :input="input"
            v-model="inner"
            :envId="envId"
            :disabled="disabled"
            :allValues="allValues"
            :isNew="isNew"
        />
        <TextInput
            v-else-if="input.type === 'text'"
            :input="input"
            v-model="inner"
            :envId="envId"
            :disabled="disabled"
            :allValues="allValues"
            :isNew="isNew"
        />
        <div class="alert alert-warning mb-3" v-else>
            Oh no, I don't know how to render this: {{ input }}
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType, watch } from "vue";
import { UiSchemaInput } from "@platzio/sdk";
import { isEqual } from "lodash";
import JsonLogic from "json-logic-js";

export default defineComponent({
    props: {
        envId: {
            type: String,
            required: true,
        },
        input: {
            type: Object as PropType<UiSchemaInput>,
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

        const visible = computed(
            () => {
                if (props.input.showIf != undefined) {
                    // Keeping the behavior of the rust code in chart-ext/ui_schema.rs, in which only if the
                    // json logic is valid and translates to true, the field is displayed
                    try {
                        return JsonLogic.apply(props.input.showIf, props.allValues) === true
                    }
                    catch {
                        return false
                    }
                } else if (props.input.showIfAll != undefined) {
                    return props.input.showIfAll.every(
                    (fv) => props.allValues[fv.field] === fv.value
                )
                } else {
                    return true
                }
            });

        return {
            visible,
            inner,
        };
    },
});
</script>
