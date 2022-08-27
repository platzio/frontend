<template>
  <PlatzModal
    ref="modal"
    :title="`Remove ${kind} ${role}`"
    btn-class="btn-danger"
    :error="error"
    :working="working"
    @submit="submit"
  >
    <div class="alert alert-danger mb-2">
      <FaIcon icon="exclamation-triangle" fixed-width />
      You are about to remove the following
      {{ role && role.toLowerCase() }} from {{ kind && kind.toLowerCase() }}:
    </div>
    <div class="my-3 p-3 rounded border fw-bold bg-light" v-if="permission">
      <PlatzUser :id="permission.user_id" :show-name="true" />
    </div>
    <div class="mt-2">Are you sure you want to continue?</div>
  </PlatzModal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { useStore } from "@/store";
import { DeploymentPermission, UserDeploymentRole } from "@/store/models/deployment-permission";

function initialData(): {
  error: any;
  working: boolean;
  kind?: string;
  role?: UserDeploymentRole;
  permission?: DeploymentPermission;
} {
  return {
    error: undefined,
    working: false,
    kind: undefined,
    role: undefined,
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

    function open(kind: string, role: UserDeploymentRole, permission: DeploymentPermission) {
      Object.assign(state, initialData());
      state.kind = kind;
      state.role = role;
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
        await store!.collections.deploymentPermissions.deleteItem(state.permission.id);
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
