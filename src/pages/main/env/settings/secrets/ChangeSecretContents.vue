<template>
    <PlatzModal
        ref="modal"
        title="Change Secret Contents"
        size="lg"
        btn-class="btn-primary"
        :error="error"
        :working="disabled"
        @submit="submit"
    >
        <div class="mb-3">
            Enter new contents for the <strong>{{ name }}</strong> secret:
        </div>

        <div class="mb-3 form-floating">
            <input
                type="text"
                class="form-control"
                id="contents"
                v-model="contents"
                required
                :disabled="disabled"
                autocomplete="off"
                spellcheck="off"
                autocapitalize="off"
            />
            <label class="form-label">New Contents</label>
        </div>
    </PlatzModal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { Secret } from "@platzio/sdk";
import { useStore } from "@/store";
import PlatzModal from "@/components/base/PlatzModal.vue";

function initialData(): {
    error: any;
    disabled: boolean;
    id?: string;
    name?: string;
    contents: string;
} {
    return {
        error: undefined,
        disabled: false,
        id: undefined,
        name: undefined,
        contents: "",
    };
}

export default defineComponent({
    props: {
        envId: {
            type: String,
            required: true,
        },
    },

    components: {
        PlatzModal,
    },

    setup() {
        const store = useStore();
        const state = reactive({ ...initialData() });
        const modal = ref<typeof PlatzModal>();

        function open(secret: Secret) {
            Object.assign(state, initialData());
            state.id = secret.id;
            state.name = secret.name;
            modal.value!.open();
        }

        function close() {
            modal.value!.close();
        }

        async function submit() {
            if (!state.id) {
                return;
            }
            try {
                state.disabled = true;
                state.error = null;
                await store!.collections.secrets.updateItem({
                    id: state.id,
                    data: {
                        contents: state.contents,
                    },
                });
                modal.value!.close();
            } catch (error) {
                state.error = error;
                state.disabled = false;
            }
        }

        return {
            modal,
            open,
            close,
            submit,
            ...toRefs(state),
        };
    },
});
</script>
