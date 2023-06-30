<template>
    <span v-if="fromNow">{{ fromNowFmt }}</span>
    <span v-if="absolute" class="text-body-secondary ms-1"
        >({{ absoluteFmt }})</span
    >
</template>

<script lang="ts">
import moment from "moment";
import { computed, defineComponent } from "vue";

export default defineComponent({
    props: {
        value: {
            type: String,
            required: true,
        },
        fromNow: {
            type: Boolean,
            default: true,
        },
        absolute: {
            type: Boolean,
            default: true,
        },
    },

    setup(props) {
        const _moment = computed(() => moment(props.value));
        const fromNowFmt = computed(() => _moment.value.fromNow());
        const absoluteFmt = computed(() => _moment.value.format("LLL"));

        return {
            fromNowFmt,
            absoluteFmt,
        };
    },
});
</script>
