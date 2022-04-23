<template>
  <Modal
    ref="modal"
    :title="`Add ${kind} ${role}`"
    btn-class="btn-primary"
    :error="error"
    :working="working"
    @submit="submit"
  >
    <div class="mb-2">
      Select a user to be added as {{ article }}
      {{ role && role.toLowerCase() }} for
      {{ kind && kind.toLowerCase() }}
    </div>
    <div class="my-3">
      <select
        class="form-select"
        v-model="user_id"
        :disabled="possibleUsers.length === 0"
      >
        <option v-for="user in possibleUsers" :value="user.id" :key="user.id">
          {{ user.display_name }}
        </option>
      </select>
      <div class="small text-muted" v-if="possibleUsers.length === 0">
        It looks like all possible users already have permissions for this
        deployment kind.
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from "vue";
import Modal from "@/components/base/Modal.vue";
import { useStore } from "@/store";
import { UserDeploymentRole } from "@/store/models/deployment-permission";

function initialData(): {
  error: any;
  working: boolean;
  kind?: string;
  role?: UserDeploymentRole;
  user_id?: string;
} {
  return {
    error: undefined,
    working: false,
    kind: undefined,
    role: undefined,
    user_id: undefined,
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
    Modal,
  },

  setup(props) {
    const store = useStore();
    const state = reactive({ ...initialData() });
    const modal = ref<typeof Modal>();

    const article = computed(() =>
      state.role && state.role.match(/^([aeiou])/i) ? "an" : "a"
    );

    const possibleUsers = computed(() =>
      store!.collections.users.all.filter((user) =>
        store!.collections.deploymentPermissions.all
          .filter((permission) => permission.env_id == props.envId)
          .filter((permission) => permission.kind == state.kind)
          .every((permission) => permission.user_id != user.id)
      )
    );

    function open(kind: string, role: UserDeploymentRole) {
      Object.assign(state, initialData());
      state.kind = kind;
      state.role = role;
      modal.value!.open();
    }

    function close() {
      modal.value!.close();
    }

    async function submit() {
      try {
        state.working = true;
        state.error = null;
        await store!.collections.deploymentPermissions.createItem({
          env_id: props.envId,
          user_id: state.user_id,
          kind: state.kind,
          role: state.role,
        });
        modal.value!.close();
      } catch (error) {
        state.error = error;
        state.working = false;
      }
    }

    return {
      modal,
      article,
      possibleUsers,
      open,
      close,
      submit,
      ...toRefs(state),
    };
  },
});
</script>