<template>
  <PlatzModal
    ref="modal"
    size="lg"
    title="Edit Node Selector and Tolerations"
    btn-class="btn-primary"
    :error="state.error"
    :working="state.working"
    submit-text="Save Changes"
    @submit="submit"
  >
    <div class="mb-3">
      Please enter updated values for node selector and tolerations:
    </div>

    <div class="form-floating">
      <YamlInput
        id="nodeSelector"
        v-model="state.node_selector"
        :disabled="state.working"
      />
      <label for="nodeSelector" class="form-label">
        Node Selector (YAML)
      </label>
    </div>

    <div class="form-floating">
      <YamlInput
        id="tolerations"
        v-model="state.tolerations"
        :disabled="state.working"
      />
      <label for="nodeSelector" class="form-label">Tolerations (YAML)</label>
    </div>

    <div class="mt-1 alert alert-warning">
      <div class="my-1 fw-bold">
        <FaIcon icon="exclamation-triangle" fixed-width />
        Careful
      </div>
      <div class="my-1">
        Saving these changes, even without changing anything, will immediately
        re-deploy all currently enabled deployments in this env.
      </div>
    </div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { type Env } from "@platzio/sdk";
import PlatzModal from "@/components/base/PlatzModal.vue";
import YamlInput from "@/components/inputs/YamlInput.vue";
import { useStore } from "@/store";

function initialData(): {
  error: any;
  working: boolean;
  node_selector: Record<string, string>;
  tolerations: Record<string, string>;
} {
  return {
    error: undefined,
    working: false,
    node_selector: {},
    tolerations: {},
  };
}

const props = defineProps<{
  envId: string;
}>();

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

function open(env: Env) {
  Object.assign(state, initialData());
  state.node_selector = env.node_selector;
  state.tolerations = env.tolerations;
  modal.value?.open();
}

function close() {
  modal.value?.close();
}

async function submit() {
  try {
    state.working = true;
    state.error = null;
    await store?.collections.envs.updateItem({
      id: props.envId,
      data: {
        node_selector: state.node_selector,
        tolerations: state.tolerations,
      },
    });
    modal.value?.close();
  } catch (error) {
    state.error = error;
    state.working = false;
  }
}

defineExpose({ open, close });
</script>
