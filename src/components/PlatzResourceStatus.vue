<template>
    <div class="d-flex flex-row align-items-center">
        <div
            v-for="(status_class, idx) in status_classes"
            :class="`dot ${status_class}`"
            :key="idx"
        />
    </div>
</template>

<style lang="scss" scoped>
.dot {
    border-radius: 50%;
    width: 0.6rem;
    height: 0.6rem;
}
</style>

<script lang="ts">
import { useStore } from "@/store";
import { DeploymentReportedStatusColor } from "@platzio/sdk";
import { computed, defineComponent } from "vue";

export default defineComponent({
    props: {
        id: {
            type: String,
            required: true,
        },
    },

    setup(props) {
        const store = useStore();

        const resource = computed(() =>
            store!.collections.k8sResources.getOne(props.id)
        );

        const status_classes = computed(() => {
            if (!resource.value) {
                return [];
            }
            return resource.value.status_color.map((color) => {
                switch (color) {
                    case DeploymentReportedStatusColor.Danger:
                        return "bg-danger";
                    case DeploymentReportedStatusColor.Primary:
                        return "bg-primary";
                    case DeploymentReportedStatusColor.Secondary:
                        return "bg-secondary";
                    case DeploymentReportedStatusColor.Success:
                        return "bg-success";
                    case DeploymentReportedStatusColor.Warning:
                        return "bg-warn";
                }
                return "bg-secondary";
            });
        });

        return {
            resource,
            status_classes,
        };
    },
});
</script>
