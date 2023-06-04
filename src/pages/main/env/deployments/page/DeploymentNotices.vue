<template>
    <div
        v-for="(notice, idx) in notices"
        :key="idx"
        class="alert mb-2"
        :class="{
            'alert-info': notice.level == DeploymentReportedNoticeLevel.Info,
            'alert-warning':
                notice.level == DeploymentReportedNoticeLevel.Warning,
            'alert-danger':
                notice.level == DeploymentReportedNoticeLevel.Danger,
        }"
    >
        <div>
            <FaIcon
                v-if="notice.level == DeploymentReportedNoticeLevel.Info"
                icon="info-circle"
                fixed-width
            />
            <FaIcon v-else icon="exclamation-triangle" fixed-width />
            {{ notice.text }}
        </div>
        <div v-if="notice.extra_info" class="mt-1 small fw-bold opacity-75">
            {{ notice.extra_info }}
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { Deployment, DeploymentReportedNoticeLevel } from "@platzio/sdk";
import { deploymentStatusNotices } from "@/store/models/deployment-status";

export default defineComponent({
    props: {
        deployment: {
            type: Object as PropType<Deployment>,
            required: true,
        },
    },

    setup(props) {
        const notices = computed(() =>
            deploymentStatusNotices(props.deployment)
        );

        return {
            notices,
            DeploymentReportedNoticeLevel,
        };
    },
});
</script>
