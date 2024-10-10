<template>
  <PlatzModal
    ref="modal"
    size="lg"
    :title="state.title"
    :submit-text="state.submitText"
    :topError="state.topError"
    :error="state.bottomError"
    :working="state.working"
    @submit="submit"
  >
    <DeploymentForm
      :envId="envId"
      :currentData="state.current"
      :working="state.working"
      ref="form"
    />
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { cloneDeep } from "lodash";
import { type Deployment } from "@platzio/sdk";
import { useStore } from "@/store";
import PlatzModal from "@/components/base/PlatzModal.vue";
import DeploymentForm from "./DeploymentForm.vue";

function initialData(): {
  topError: any;
  bottomError: any;
  working: boolean;
  title: string;
  submitText: string;
  current: Partial<Deployment>;
} {
  return {
    topError: null,
    bottomError: null,
    working: false,
    title: "Create Deployment",
    submitText: "Create Deployment",
    current: {
      name: "",
      config: {},
    },
  };
}

defineProps<{
  envId: string;
}>();

const store = useStore();
const state = reactive(initialData());
const modal = ref<typeof PlatzModal>();
const form = ref<typeof DeploymentForm>();

function openForCreate(kind_id: string) {
  Object.assign(state, initialData());
  state.current = cloneDeep({ kind_id });
  modal.value?.open();
}

function openForEdit(current: Partial<Deployment>) {
  Object.assign(state, initialData());
  state.current = cloneDeep(current);
  state.title = "Edit Deployment";
  state.submitText = "Save Changes";
  modal.value?.open();
}

function openForCloneFrom(from: Partial<Deployment>) {
  Object.assign(state, initialData());
  state.current = cloneDeep(from);
  state.title = `Create Deployment Based On ${state.current.name}`;
  state.current.id = undefined;
  state.current.name = undefined;
  modal.value?.open();
}

async function submitWithoutOpening(current: Partial<Deployment>) {
  Object.assign(state, initialData());
  state.current = cloneDeep(current);
  try {
    if (!state.current.id) {
      throw new Error("submitWithoutOpening called without id");
    }
    state.working = true;
    state.topError = null;
    state.bottomError = null;
    await store?.collections.deployments.updateItem({
      id: state.current.id,
      data: state.current,
    });
  } catch (error) {
    state.topError = error;
    state.bottomError = null;
    state.working = false;
    modal.value?.open();
  }
}

function close() {
  modal.value?.close();
}

async function submit() {
  try {
    state.working = true;
    state.bottomError = null;
    await form.value?.save();
    close();
  } catch (error) {
    state.bottomError = error;
    state.working = false;
  }
}

defineExpose({
  openForCreate,
  openForEdit,
  openForCloneFrom,
  submitWithoutOpening,
});
</script>
