<template>
    <div class="d-flex flex-column align-items-center">
        <div class="d-flex flex-row align-items-end" :class="valueClass">
            <span class="h2 my-0 me-1 fw-bold">
                {{ value }}
            </span>
            <span class="fw-bold">
                {{ metric.unit }}
            </span>
        </div>
        <div class="small text-uppercase text-muted">
            {{ metric.short_description }}
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { DeploymentReportedMetric } from "@platzio/sdk";

// https://stackoverflow.com/questions/2685911/is-there-a-way-to-round-numbers-into-a-reader-friendly-format-e-g-1-1k/10600491#10600491
const UNITS = "KMBT";

function round(n: number, precision: number): number {
    const prec = Math.pow(10, precision);
    return Math.round(n * prec) / prec;
}

function formatNumber(n: number): string {
    let base = Math.floor(Math.log(Math.abs(n)) / Math.log(1000));
    const suffix = UNITS[Math.min(2, base - 1)];
    base = UNITS.indexOf(suffix) + 1;
    return suffix
        ? round(n / Math.pow(1000, base), 2) + suffix
        : `${round(n, 3)}`;
}

export default defineComponent({
    props: {
        metric: {
            type: Object as PropType<DeploymentReportedMetric>,
            required: true,
        },
    },

    setup(props) {
        const value = computed(() => {
            const value = props.metric.value;
            if (!value) {
                return value;
            }
            const number = parseFloat(value);
            if (isNaN(number)) {
                return value;
            }
            return formatNumber(number);
        });

        const valueClass = computed(() =>
            props.metric.color ? `text-${props.metric.color}` : ""
        );

        return {
            value,
            valueClass,
        };
    },
});
</script>
