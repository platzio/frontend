<template>
  <PlatzModal
    ref="modal"
    :title="`Delete ${resourceType && resourceType.spec.name_singular}`"
    btn-class="btn-danger"
    :error="state.error"
    :working="state.disabled"
    @submit="submit"
  >
    <div class="alert alert-danger">
      <div class="mb-1 fw-bold">
        <FaIcon icon="exclamation-circle" />
        Careful
      </div>
      <div>
        You are about to delete this
        {{ resourceType && resourceType.spec.name_singular }}:
      </div>
    </div>

    <div class="border p-2" v-if="resource">
      <ResourceRow :resource="resource" />
    </div>

    <div class="mt-3">Are you sure you want to continue?</div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { useStore } from "@/store";
import ResourceRow from "./ResourceRow.vue";

function initialData(): { error: any; disabled: boolean; id?: string } {
  return {
    error: undefined,
    disabled: false,
    id: undefined,
  };
}

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

const resource = computed(() =>
  state.id ? store!.collections.deploymentResources.getOne(state.id) : null
);

const resourceType = computed(
  () =>
    resource.value &&
    store!.collections.deploymentResourceTypes.getOne(resource.value.type_id)
);

function open(id: string) {
  Object.assign(state, initialData());
  state.id = id;
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
    await store!.collections.deploymentResources.deleteItem(state.id);
    modal.value!.close();
  } catch (error) {
    state.error = error;
    state.disabled = false;
  }
}

defineExpose({ open, close });
</script>
