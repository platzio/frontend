<template>
  <PlatzModal
    ref="modal"
    :title="`Add ${kind?.name} ${state.role}`"
    btn-class="btn-primary"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div class="mb-2">
      Select a user to be added as {{ article }}
      {{ state.role?.toLowerCase() }} for
      {{ kind?.name.toLowerCase() }}
    </div>
    <div class="my-3">
      <select
        v-model="state.user_id"
        class="form-select"
        :disabled="!possibleUsers?.length"
      >
        <option v-for="user in possibleUsers" :key="user.id" :value="user.id">
          {{ user.display_name }}
        </option>
      </select>
      <div v-if="!possibleUsers?.length" class="small text-body-secondary">
        It looks like all possible users already have permissions for this
        deployment kind.
      </div>
    </div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { UserDeploymentRole } from "@platzio/sdk";
import { useStore } from "@/store";
import PlatzModal from "@/components/base/PlatzModal.vue";

function initialData(): {
  error: any;
  working: boolean;
  kind_id?: string;
  role?: UserDeploymentRole;
  user_id?: string;
} {
  return {
    error: undefined,
    working: false,
    kind_id: undefined,
    role: undefined,
    user_id: undefined,
  };
}

const props = defineProps<{
  envId: string;
}>();

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

const kind = computed(() =>
  state.kind_id
    ? store?.collections.deploymentKinds.getOne(state.kind_id)
    : undefined
);

const article = computed(() =>
  state.role && state.role.match(/^([aeiou])/i) ? "an" : "a"
);

const possibleUsers = computed(() =>
  store?.collections.users.all.filter((user) =>
    store?.collections.deploymentPermissions.all
      .filter((permission) => permission.env_id == props.envId)
      .filter((permission) => permission.kind_id == state.kind_id)
      .every((permission) => permission.user_id != user.id)
  )
);

function open(kind_id: string, role: UserDeploymentRole) {
  Object.assign(state, initialData());
  state.kind_id = kind_id;
  state.role = role;
  modal.value?.open();
}

function close() {
  modal.value?.close();
}

async function submit() {
  if (!state.user_id || !state.kind_id || !state.role) {
    return;
  }
  try {
    state.working = true;
    state.error = null;
    await store?.collections.deploymentPermissions.createItem({
      env_id: props.envId,
      user_id: state.user_id,
      kind_id: state.kind_id,
      role: state.role,
    });
    modal.value?.close();
  } catch (error) {
    state.error = error;
    state.working = false;
  }
}

defineExpose({ open, close });
</script>
