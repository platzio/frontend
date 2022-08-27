<template>
  <PlatzModal
    ref="modal"
    size="lg"
    title="Edit Deployment Description"
    submit-text="Save Changes"
    :error="error"
    :working="working"
    @submit="submit"
  >
    <div class="mb-3 text-secondary">
      The description below would appear in the deployment page, use an empty value to remove the
      deployment description.
    </div>
    <textarea
      class="form-control font-monospace"
      :id="`edit-description-${id}`"
      @change="changed"
      style="height: 20rem"
      v-model="markdown"
      :disabled="working"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      placeholder="Enter a description, or leave empty to remove it"
    />
    <div class="my-2 small text-muted">
      <FaIcon :icon="['fab', 'markdown']" brand fixed-width />
      Markdown formatting is supported, emojis encouraged ⭐️
    </div>
  </PlatzModal>
</template>

<script lang="ts">
import PlatzModal from "@/components/base/PlatzModal.vue";
import { useStore } from "@/store";
import { Deployment } from "@/store/models/deployment";
import { defineComponent, reactive, ref, toRefs } from "vue";

function initialData(): {
  error: any;
  working: boolean;
  id: string;
  markdown: string;
} {
  return {
    error: null,
    working: false,
    id: "",
    markdown: "",
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

    function open(deployment: Deployment) {
      Object.assign(state, initialData());
      state.id = deployment.id;
      state.markdown = deployment.description_md || "";
      modal.value!.open();
    }

    function close() {
      modal.value!.close();
    }

    async function submit() {
      try {
        state.working = true;
        state.error = null;
        await store!.collections.deployments.updateItem({
          id: state.id,
          data: {
            description_md: state.markdown,
          },
        });
        close();
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
