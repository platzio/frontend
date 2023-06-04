<template>
    <PlatzModal
        ref="modal"
        title="Revoke User Token"
        btn-class="btn-danger"
        :error="error"
        :working="disabled"
        @submit="submit"
    >
        <div class="my-3 alert alert-danger" v-if="token">
            <div class="my-2 fw-bold">
                <FaIcon icon="triangle-exclamation" fixed-width />
                Careful
            </div>
            <div class="my-2">
                You are about to revoke the user token
                <strong>{{ token.id }}</strong>
            </div>
        </div>

        <div class="my-3">Are you sure you want to continue?</div>
    </PlatzModal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { UserToken } from "@platzio/sdk";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { userTokens } from "./collection";

function initialData(): {
    error: any;
    disabled: boolean;
    token?: UserToken;
} {
    return {
        error: undefined,
        disabled: false,
        token: undefined,
    };
}

export default defineComponent({
    components: {
        PlatzModal,
    },

    setup() {
        const state = reactive({ ...initialData() });
        const modal = ref<typeof PlatzModal>();

        function open(token: UserToken) {
            Object.assign(state, initialData());
            state.token = token;
            modal.value!.open();
        }

        function close() {
            modal.value!.close();
        }

        async function submit() {
            if (!state.token) {
                return;
            }
            try {
                state.disabled = true;
                state.error = null;
                await userTokens.deleteItem(state.token.id);
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
