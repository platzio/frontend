<template>
  <PlatzModal
    ref="modal"
    title="Change Secret Contents"
    size="lg"
    btn-class="btn-primary"
    :error="state.error"
    :working="state.disabled"
    @submit="submit"
  >
    <div class="mb-3">
      Enter new contents for the <strong>{{ state.name }}</strong> secret:
    </div>

    <div class="mb-3 form-floating">
      <input
        type="text"
        class="form-control"
        id="contents"
        v-model="state.contents"
        required
        :disabled="state.disabled"
        autocomplete="off"
        spellcheck="false"
        autocapitalize="off"
      />
      <label class="form-label">New Contents</label>
    </div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { type Secret } from "@platzio/sdk";
import { useStore } from "@/store";
import PlatzModal from "@/components/base/PlatzModal.vue";

function initialData(): {
  error: any;
  disabled: boolean;
  id?: string;
  name?: string;
  contents: string;
} {
  return {
    error: undefined,
    disabled: false,
    id: undefined,
    name: undefined,
    contents: "",
  };
}

defineProps<{
  envId: string;
}>();

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

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
    await store!.collections.secrets.updateItem({
      id: state.id,
      data: {
        contents: state.contents,
      },
    });
    modal.value!.close();
  } catch (error) {
    state.error = error;
    state.disabled = false;
  }
}

defineExpose({ open, close });
</script>
