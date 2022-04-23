<template>
    <Modal ref="modal" size="lg" title="Edit Auto Add New Users" btn-class="btn-primary" :error="error"
        :working="disabled" @submit="submit" submitText="Save Changes">
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="auto_add_new_users"
                v-model="auto_add_new_users" :disabled="disabled" />
            <label class="form-check-label" for="auto_add_new_users">
                Automatically add new users to this env
            </label>
        </div>
    </Modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import Modal from "@/components/base/Modal.vue";
import { useStore } from "@/store";
import { Env } from "@/store/models/env";

function initialData(): {
    error: any;
    disabled: boolean;
    auto_add_new_users: boolean;
} {
    return {
        error: undefined,
        disabled: false,
        auto_add_new_users: false,
    };
}

export default defineComponent({
    components: {
        Modal,
    },

    props: {
        envId: {
            required: true,
            type: String,
        },
    },

    setup(props) {
        const store = useStore();
        const state = reactive({ ...initialData() });
        const modal = ref<typeof Modal>();

        function open(env: Env) {
            Object.assign(state, initialData());
            state.auto_add_new_users = env.auto_add_new_users;
            modal.value!.open();
        }

        function close() {
            modal.value!.close();
        }

        async function submit() {
            try {
                state.disabled = true;
                state.error = null;
                await store!.collections.envs.updateItem({
                    id: props.envId,
                    data: {
                        auto_add_new_users: state.auto_add_new_users,
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
