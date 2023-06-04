<template>
    <PlatzModal
        ref="modal"
        title="Rename Secret"
        btn-class="btn-primary"
        :error="error"
        :working="disabled"
        @submit="submit"
    >
        <div class="mb-3">
            Enter a new name for the <strong>{{ oldName }}</strong> secret:
        </div>

        <div class="mb-3 form-floating">
            <input
                type="text"
                class="form-control"
                id="name"
                v-model="name"
                required
                :disabled="disabled"
            />
            <label class="form-label">New Secret Name</label>
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
    oldName?: string;
    name?: string;
} {
    return {
        error: undefined,
        disabled: false,
        id: undefined,
        oldName: undefined,
        name: undefined,
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
            state.oldName = secret.name;
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
                        name: state.name,
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
