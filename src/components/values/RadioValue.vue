<template>
    <div v-if="value || showEmpty">
        <span class="text-secondary" v-if="showLabel">
            {{ input.label }}:
        </span>
        <span class="text-monospace fw-bold" v-if="value">
            {{ display }}
        </span>
        <span class="text-secondary fst-italic" v-else>(empty)</span>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { UiSchemaInput } from "@platzio/sdk";

export default defineComponent({
    props: {
        input: {
            type: Object as PropType<UiSchemaInput>,
            required: true,
        },
        value: {
            required: true,
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
        const display = computed(() => {
            for (const option of props.input.options || []) {
                if (option.value == props.value) {
                    return option.label || option.value;
                }
            }
            return props.value;
        });

        return {
            display,
        };
    },
});
</script>
