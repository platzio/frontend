<template>
  <PlatzModal
    ref="modal"
    :title="state.action ? state.action.title : ''"
    size="lg"
    btn-class="btn-success"
    :topError="undefined"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div class="mb-3">
      {{ state.action?.description }}
    </div>

    <ConfigInputsForm
      :envId="envId"
      :uiSchema="state.action?.ui_schema"
      v-model="state.body"
      :disabled="state.working"
    />

    <div
      class="alert alert-warning"
      v-if="state.action && state.action.dangerous"
    >
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          :disabled="state.working"
          :required="true"
          v-model="state.confirm_danger"
        />
        <label class="form-check-label">
          I, being of sound mind and body, herby declare that I am aware that
          this action is dangerous, and willfuly perform it
        </label>
      </div>
    </div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { type Deployment } from "@platzio/sdk";
import { type ChartExtActionV0 } from "@platzio/sdk";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { useStore } from "@/store";
import ConfigInputsForm from "./config/ConfigInputsForm.vue";

function initialData(): {
  error: any;
  working: boolean;
  deployment?: Deployment;
  action?: ChartExtActionV0;
  body: Record<string, any>;
  confirm_danger: boolean;
} {
  return {
    error: undefined,
    working: false,
    deployment: undefined,
    action: undefined,
    body: {},
    confirm_danger: false,
  };
}

defineProps<{
  envId: string;
}>();

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

const emit = defineEmits(["done"]);

function open(deployment: Deployment, action: ChartExtActionV0) {
  Object.assign(state, initialData());
  state.deployment = deployment;
  state.action = action;
  modal.value!.open();
}

function close() {
  modal.value!.close();
}

async function submit() {
  if (!state.deployment || !state.action) {
    return;
  }
  try {
    state.working = true;
    state.error = null;
    await store!.collections.deploymentTasks.createItem({
      deployment_id: state.deployment.id,
      operation: {
        InvokeAction: {
          helm_chart_id: state.deployment.helm_chart_id,
          action_id: state.action.id,
          body: state.body,
        },
      },
    });
    modal.value!.close();
    emit("done");
  } catch (error) {
    state.error = error;
    state.working = false;
  }
}

defineExpose({ open, close });
</script>
