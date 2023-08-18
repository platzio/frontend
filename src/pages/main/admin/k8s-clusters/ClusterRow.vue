<template>
    <div class="my-1" :class="klass">
        <span class="me-1 badge bg-secondary" v-if="cluster.ignore"
            >IGNORED</span
        >
        <span class="fw-bold">
            <FaIcon icon="cubes" fixed-width />
            {{ cluster.name }}
        </span>
    </div>

    <div
        class="my-1 small text-body-secondary d-flex flex-row"
        :class="{ opacity50: cluster.ignore }"
    >
        <div>
            <FaIcon icon="globe" class="me-1" />
            {{ cluster.region_name }}
        </div>
        <div v-if="!cluster.ignore" class="mx-2 text-body-secondary">/</div>
        <div v-if="!cluster.ignore">
            Last seen <PlatzMoment :value="cluster.last_seen_at" />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import PlatzMoment from "@/components/base/PlatzMoment.vue";
import { K8sCluster } from "@platzio/sdk";

export default defineComponent({
    components: {
        PlatzMoment,
    },

    props: {
        cluster: {
            type: Object as PropType<K8sCluster>,
            required: true,
        },
    },

    setup(props) {
        const klass = computed(() => {
            if (props.cluster.ignore) {
                return "opacity50";
            }
            if (props.cluster.is_ok) {
                return "text-success";
            }
            return "text-warning";
        });

        return {
            klass,
        };
    },
});
</script>
