<template>
  <PlatzModal
    ref="modal"
    size="lg"
    :title="title"
    :submit-text="submitText"
    :error="state.error"
    :working="state.disabled"
    @submit="submit"
  >
    <ResourceForm
      :current-data="state.current"
      :disabled="state.disabled"
      :envId="envId"
      :resourceTypeId="resourceTypeId"
      ref="form"
    />
  </PlatzModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { type DeploymentResource } from "@platzio/sdk";
import { useStore } from "@/store";
import PlatzModal from "@/components/base/PlatzModal.vue";
import ResourceForm from "./ResourceForm.vue";

function initialData(): {
  error: any;
  disabled: boolean;
  current: Partial<DeploymentResource>;
} {
  return {
    error: null,
    disabled: false,
    current: {},
  };
}

const props = defineProps<{
  envId: string;
  resourceTypeId: string;
}>();

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();
const form = ref<typeof ResourceForm>();

const resourceType = computed(() =>
  store!.collections.deploymentResourceTypes.getOne(props.resourceTypeId)
);

const title = computed(
  () =>
    `${state.current.id ? "Edit" : "Add"} ${
      resourceType.value && resourceType.value.spec.name_singular
    }`
);

const submitText = computed(() =>
  state.current.id ? "Save Changes" : title.value
);

function open(current: DeploymentResource) {
  Object.assign(state, initialData());
  state.current = Object.assign({ env_id: props.envId }, current);
  modal.value!.open();
}

function close() {
  modal.value!.close();
}

async function submit() {
  try {
    state.disabled = true;
    state.error = null;
    await form.value!.save();
    close();
  } catch (error) {
    state.error = error;
    state.disabled = false;
  }
}

defineExpose({ open, close });
</script>
