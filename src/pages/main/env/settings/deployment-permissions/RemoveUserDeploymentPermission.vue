<template>
  <PlatzModal
    ref="modal"
    :title="`Remove ${kind?.name} ${state.role}`"
    btn-class="btn-danger"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div class="alert alert-danger mb-2">
      <FaIcon icon="exclamation-triangle" fixed-width />
      You are about to remove the following
      {{ state.role?.toLowerCase() }} from {{ kind?.name.toLowerCase() }}:
    </div>
    <div
      class="my-3 p-3 rounded border fw-bold bg-light-subtle"
      v-if="state.permission"
    >
      <PlatzUser :id="state.permission.user_id" :show-name="true" />
    </div>
    <div class="mt-2">Are you sure you want to continue?</div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { type DeploymentPermission, UserDeploymentRole } from "@platzio/sdk";
import PlatzModal from "@/components/base/PlatzModal.vue";
import PlatzUser from "@/components/PlatzUser.vue";
import { useStore } from "@/store";

function initialData(): {
  error: any;
  working: boolean;
  kind_id?: string;
  role?: UserDeploymentRole;
  permission?: DeploymentPermission;
} {
  return {
    error: undefined,
    working: false,
    kind_id: undefined,
    role: undefined,
    permission: undefined,
  };
}

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

const kind = computed(() =>
  state.kind_id
    ? store?.collections.deploymentKinds.getOne(state.kind_id)
    : undefined
);

function open(
  kind_id: string,
  role: UserDeploymentRole,
  permission: DeploymentPermission
) {
  Object.assign(state, initialData());
  state.kind_id = kind_id;
  state.role = role;
  state.permission = permission;
  modal.value?.open();
}

function close() {
  modal.value?.close();
}

async function submit() {
  if (!state.permission) {
    return;
  }
  try {
    state.working = true;
    state.error = null;
    await store?.collections.deploymentPermissions.deleteItem(
      state.permission.id
    );
    modal.value?.close();
  } catch (error) {
    state.error = error;
    state.working = false;
  }
}

defineExpose({ open, close });
</script>
