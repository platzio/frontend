<template>
  <PlatzModal
    ref="modal"
    size="lg"
    title="Edit Deployment Description"
    submit-text="Save Changes"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div class="mb-3 text-secondary">
      The description below would appear in the deployment page, use an empty
      value to remove the deployment description.
    </div>
    <textarea
      class="form-control font-monospace"
      :id="`edit-description-${state.id}`"
      style="height: 20rem"
      v-model="state.markdown"
      :disabled="state.working"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      placeholder="Enter a description, or leave empty to remove it"
    />
    <div class="my-2 small text-body-secondary">
      <FaIcon :icon="['fab', 'markdown']" brand fixed-width />
      Markdown formatting is supported, emojis encouraged ⭐️
    </div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { type Deployment } from "@platzio/sdk";
import { useStore } from "@/store";
import PlatzModal from "@/components/base/PlatzModal.vue";

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

defineExpose({ open, close });
</script>
