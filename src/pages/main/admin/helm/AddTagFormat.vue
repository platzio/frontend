<template>
  <Modal
    ref="modal"
    title="Add Tag Format"
    btn-class="btn-primary"
    :error="error"
    :working="working"
    size="lg"
    @submit="submit"
  >
    <div class="mb-2">Enter a new Helm tag pattern below.</div>
    <div class="mb-2">
      When a pattern successfully matches a Helm tag, the following named groups are used:
    </div>
    <ul>
      <li><code>version</code></li>
      <li><code>revision</code></li>
      <li><code>branch</code></li>
      <li><code>commit</code></li>
    </ul>
    <div class="mb-2">Note that if a pattern already exists it cannot be added again.</div>
    <div class="mb-2">
      It's recommended to wrap the pattern in <code>^</code> and <code>$</code>, but this is not
      mandatory in case this messes with parsing somehow.
    </div>
    <div class="my-3">
      <input
        type="text"
        class="form-control"
        v-model="pattern"
        placeholder="^(regular-expression)$"
        required
      />
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
  pattern?: string;
} {
  return {
    error: undefined,
    working: false,
    pattern: undefined,
  };
}

export default defineComponent({
  components: {
    Modal,
  },

  setup() {
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
        await store!.collections.helmTagFormats.createItem({
          pattern: state.pattern,
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