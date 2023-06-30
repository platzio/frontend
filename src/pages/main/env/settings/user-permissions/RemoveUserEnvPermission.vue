<template>
    <PlatzModal
        ref="modal"
        title="Remove User Permission"
        btn-class="btn-danger"
        :error="error"
        :working="working"
        @submit="submit"
    >
        <div class="alert alert-danger mb-2" v-if="permission">
            <FaIcon icon="exclamation-triangle" fixed-width />
            You are about to remove the
            <span class="mx-1 badge bg-success">{{
                permission.role.toUpperCase()
            }}</span>
            permission for the following user:
        </div>
        <div
            class="my-3 p-3 rounded border fw-bold bg-light-subtle"
            v-if="permission"
        >
            <PlatzUser :id="permission.user_id" :show-name="true" />
        </div>
        <div class="mt-2">Are you sure you want to continue?</div>
    </PlatzModal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { EnvUserPermission } from "@platzio/sdk";
import { useStore } from "@/store";
import PlatzModal from "@/components/base/PlatzModal.vue";

function initialData(): {
    error: any;
    working: boolean;
    permission?: EnvUserPermission;
} {
    return {
        error: undefined,
        working: false,
        permission: undefined,
    };
}

export default defineComponent({
    components: {
        PlatzModal,
    },

    setup() {
        const store = useStore();
        const state = reactive({ ...initialData() });
        const modal = ref<typeof PlatzModal>();

        function open(permission: EnvUserPermission) {
            Object.assign(state, initialData());
            state.permission = permission;
            modal.value!.open();
        }

        function close() {
            modal.value!.close();
        }

        async function submit() {
            if (!state.permission) {
                return;
            }
            try {
                state.working = true;
                state.error = null;
                await store!.collections.envUserPermissions.deleteItem(
                    state.permission.id
                );
                modal.value!.close();
            } catch (error) {
                state.error = error;
                state.working = false;
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
