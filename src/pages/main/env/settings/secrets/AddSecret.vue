<template>
  <Modal
    ref="modal"
    title="Add Secret"
    btn-class="btn-primary"
    :error="error"
    :working="working"
    @submit="submit"
  >
    <div class="mb-3 form-floating">
      <input
        type="name"
        class="form-control"
        id="name"
        v-model="name"
        required
        :disabled="working"
      />
      <label class="form-label">Name</label>
    </div>
    <div class="mb-3 form-floating">
      <input
        type="contents"
        class="form-control"
        id="contents"
        v-model="contents"
        required
        :disabled="working"
      />
      <label class="form-label">Contents</label>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import Modal from "@/components/base/Modal.vue";
import { useStore } from "@/store";

function initialData(): {
  error: any;
  working: boolean;
  name?: string;
  contents?: string;
} {
  return {
    error: undefined,
    working: false,
    name: undefined,
    contents: undefined,
  };
}

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
    collection: {
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

    function open() {
      Object.assign(state, initialData());
      modal.value!.open();
    }

    function close() {
      modal.value!.close();
    }

    async function submit() {
      try {
        state.working = true;
        state.error = null;
        await store!.collections.secrets.createItem({
          env_id: props.envId,
          collection: props.collection,
          name: state.name,
          contents: state.contents,
        });
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
