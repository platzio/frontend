<template>
  <Modal
    ref="modal"
    title="Set Category"
    btn-class="btn-primary"
    :error="error"
    :working="working"
    @submit="submit"
  >
    <div class="mb-2">
      Enter a category name for the helm registry:
    </div>
    <div class="my-3">
      <input
        type="text"
        class="form-control"
        v-model="new_category"
        required
        placeholder="Enter a category name"
      />
      <div class="small my-1 text-muted">
        Category names are everything sensitive (case, whitespace, sign)
        although they might be displayed as uppercase-only in some cases.
      </div>
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
  registry_id?: string;
  new_category?: string;
} {
  return {
    error: undefined,
    working: false,
    registry_id: undefined,
    new_category: undefined
  };
}

export default defineComponent({
  components: {
    Modal
  },

  setup() {
    const store = useStore();
    const state = reactive({ ...initialData() });
    const modal = ref<typeof Modal>();

    function open(registry_id: string) {
      Object.assign(state, initialData());
      state.registry_id = registry_id;
      state.new_category = store!.collections.helmRegistries.getOne(
        registry_id
      ).category;
      modal.value!.open();
    }

    function close() {
      modal.value!.close();
    }

    async function submit() {
      if (!state.registry_id) {
        return;
      }
      try {
        state.working = true;
        state.error = null;
        await store!.collections.helmRegistries.updateItem({
          id: state.registry_id,
          data: {
            category: state.new_category
          }
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
      ...toRefs(state)
    };
  }
});
</script>
