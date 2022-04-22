<template>
  <Modal
    ref="modal"
    title="Delete Secret"
    btn-class="btn-danger"
    :error="error"
    :working="disabled"
    @submit="submit"
  >
    <div class="my-3 alert alert-danger">
      <div class="my-2 fw-bold">
        <fa icon="triangle-exclamation" fixed-width />
        Careful
      </div>
      <div class="my-2">
        You are about to delete the <strong>{{ name }}</strong> secret
      </div>
    </div>

    <div class="my-3">Are you sure you want to continue?</div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import Modal from "@/components/base/Modal.vue";
import { useStore } from "@/store";
import { Secret } from "@/store/models/secret";

function initialData(): {
  error: any;
  disabled: boolean;
  id?: string;
  name?: string;
} {
  return {
    error: undefined,
    disabled: false,
    id: undefined,
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
    Modal,
  },

  setup() {
    const store = useStore();
    const state = reactive({ ...initialData() });
    const modal = ref<typeof Modal>();

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
        await store!.collections.secrets.deleteItem(state.id);
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
