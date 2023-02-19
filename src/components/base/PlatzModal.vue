<template>
    <div class="modal fade" :id="id" tabindex="-1">
        <div class="modal-dialog" :class="dialogClasses">
            <div class="modal-content text-start">
                <form @submit="submit">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="`${id}Label`">
                            {{ title }}
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="close"
                            :disabled="working"
                        />
                    </div>

                    <div class="modal-body">
                        <PlatzError :error="topError" />
                        <slot />
                        <PlatzError :error="error" />
                    </div>

                    <div class="modal-footer">
                        <button
                            v-if="showCancel"
                            type="button"
                            class="btn btn-link"
                            @click="close"
                            :disabled="working"
                        >
                            {{ cancelText }}
                        </button>
                        <button
                            v-if="showSubmit"
                            type="submit"
                            :class="['btn', btnClass]"
                            :disabled="working"
                        >
                            {{ submitText || title }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import { Modal } from "bootstrap";

export default defineComponent({
    props: {
        title: {
            type: String,
            required: true,
        },
        size: {
            type: String as PropType<"sm" | "lg" | null>,
            default: null,
        },
        showSubmit: {
            type: Boolean,
            default: true,
        },
        submitText: {
            type: String as PropType<string | undefined>,
            required: false,
        },
        showCancel: {
            type: Boolean,
            default: true,
        },
        cancelText: {
            type: String,
            default: "Cancel",
        },
        topError: {
            type: Object as PropType<Error | undefined>,
        },
        error: {
            type: Error,
        },
        working: {
            type: Boolean,
            default: false,
        },
        btnClass: {
            type: String,
            default: "btn-primary",
        },
    },

    emits: {
        submit: null,
        close: null,
    },

    setup(props, { emit }) {
        const id = ref(`modal${Math.round(Math.random() * 10000000000000000)}`);
        const modal = ref<Modal>();

        const dialogClasses = computed(() =>
            props.size ? `modal-${props.size}` : ""
        );

        onMounted(() => {
            const elem = document.getElementById(id.value);
            if (!elem) {
                throw new Error(`Expected element with ID ${id.value}`);
            }
            modal.value = new Modal(elem);
        });

        function open() {
            if (modal.value) {
                return modal.value.show();
            }
        }

        function close() {
            if (modal.value) {
                modal.value.hide();
                emit("close");
            }
        }

        function submit(event: Event) {
            event.preventDefault();
            emit("submit");
        }

        return {
            modal,
            id,
            dialogClasses,
            open,
            close,
            submit,
        };
    },
});
</script>
