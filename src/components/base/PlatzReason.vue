<template>
    <div v-if="text" class="reason">
        <a
            v-if="allowExpand"
            :class="previewClass"
            data-bs-toggle="offcanvas"
            :aria-controls="id"
            :href="`#${id}`"
        >
            {{ preview }}
        </a>
        <div v-else :class="previewClass">
            {{ preview }}
        </div>
        <div
            v-if="allowExpand"
            :id="id"
            class="offcanvas offcanvas-end"
            tabindex="-1"
            :aria-labelledby="`header-${id}`"
        >
            <div class="offcanvas-header" :class="headerClass">
                <div class="offcanvas-title" :id="`header-${id}`">
                    <div class="h5">{{ title || "Details" }}</div>
                    <span v-if="copied" class="small text-body-secondary">
                        <FaIcon icon="copy" fixed-width />
                        Copied
                    </span>
                    <a v-else class="small text-body-tertiary" @click="copy">
                        <FaIcon icon="copy" fixed-width />
                        Copy
                    </a>
                </div>
                <div class="m-2 d-flex flex-column align-items-center">
                    <button
                        type="button"
                        class="btn-close m-0 p-0"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    />
                    <span class="m-0 p-0 text-body-tertiary">esc</span>
                </div>
            </div>
            <div class="offcanvas-body font-monospace reason-expanded">
                {{ text }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.reason {
    position: relative;
    width: 100%;

    .reason-preview {
        position: absolute;
        top: 0.1em;
        left: 0;
        right: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--bs-secondary);

        &.expandable {
            &:hover {
                opacity: 0.6;
            }
        }
    }

    &::after {
        content: ".";
        visibility: hidden;
    }
}

.reason-expanded {
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
}
</style>

<script lang="ts">
import { PropType, computed, defineComponent, onUnmounted, ref } from "vue";

export default defineComponent({
    props: {
        title: {
            type: String,
            required: false,
        },
        text: {
            type: String as PropType<string | null>,
            required: false,
        },
        isBad: {
            type: Boolean,
            default: false,
        },
        allowExpand: {
            type: Boolean,
            default: false,
        },
    },

    setup(props) {
        const id = ref(
            `reason${Math.round(Math.random() * 10000000000000000)}`
        );

        const preview = computed(() => props.text?.slice(0, 500));
        const previewClass = computed(() => [
            "reason-preview",
            "font-monospace",
            props.isBad ? "text-danger-emphasis" : "text-secondary",
            props.allowExpand ? "expandable" : "",
        ]);

        const headerClass = computed(() => [
            props.isBad ? "text-danger-emphasis" : "text-success-emphasis",
            props.isBad ? "bg-danger-subtle" : "bg-success-subtle",
        ]);

        let copiedTimeout: number | undefined = undefined;
        const copied = ref(false);
        const copy = () => {
            if (props.text) {
                navigator.clipboard.writeText(props.text);
                copied.value = true;
                copiedTimeout = setTimeout(() => {
                    copied.value = false;
                    copiedTimeout = undefined;
                }, 1250);
            }
        };

        onUnmounted(() => {
            clearTimeout(copiedTimeout);
        });

        return {
            id,
            preview,
            previewClass,
            headerClass,
            copy,
            copied,
        };
    },
});
</script>
