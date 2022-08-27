<template>
  <PlatzModal
    ref="modal"
    title="Create Env"
    btn-class="btn-primary"
    :error="error"
    :working="working"
    @submit="submit"
  >
    <div class="mb-2">Please select a name for the new env.</div>
    <div class="my-3">
      <input type="text" class="form-control" v-model="name" placeholder="Enter a name" required />
    </div>
  </PlatzModal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { useStore } from "@/store";

function initialData(): {
  error: any;
  working: boolean;
  name?: string;
} {
  return {
    error: undefined,
    working: false,
    name: undefined,
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
        await store!.collections.envs.createItem({
          name: state.name,
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
