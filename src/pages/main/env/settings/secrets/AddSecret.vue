<template>
  <PlatzModal
    ref="modal"
    title="Add Secret"
    size="lg"
    btn-class="btn-primary"
    :error="state.error"
    :working="state.disabled"
    @submit="submit"
  >
    <div class="mb-3">
      <div class="my-2 form-check">
        <input
          class="form-check-input"
          type="radio"
          name="whichCollection"
          id="useExistingCollection"
          v-model="state.createNewCollection"
          :value="false"
          :disabled="collections.length === 0"
        />
        <label class="form-check-label" for="useExistingCollection">
          Create secret in an existing collection
        </label>
      </div>
      <div class="my-2 form-check">
        <input
          class="form-check-input"
          type="radio"
          name="whichCollection"
          id="createNewCollection"
          v-model="state.createNewCollection"
          :value="true"
        />
        <label class="form-check-label" for="createNewCollection">
          Create secret in a new collection
        </label>
      </div>
    </div>

    <div class="mb-3 form-floating" v-if="!state.createNewCollection">
      <select
        class="form-select"
        id="collection"
        v-model="state.collection"
        :disabled="state.disabled"
        required
      >
        <option v-for="option in collections" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <label>Collection</label>
    </div>

    <div class="mb-3 form-floating" v-if="state.createNewCollection">
      <input
        type="text"
        class="form-control"
        id="collection"
        v-model="state.collection"
        required
        :disabled="state.disabled"
      />
      <label class="form-label">Collection Name</label>
    </div>

    <div class="mb-3 form-floating">
      <input
        type="text"
        class="form-control"
        id="name"
        v-model="state.name"
        required
        :disabled="state.disabled"
      />
      <label class="form-label">Secret Name</label>
    </div>

    <div class="mb-3 form-floating">
      <input
        type="contents"
        class="form-control"
        id="contents"
        v-model="state.contents"
        required
        :disabled="state.disabled"
        autocomplete="off"
        spellcheck="false"
        autocapitalize="off"
      />
      <label class="form-label">Contents</label>
    </div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { useStore } from "@/store";

function initialData(): {
  error: any;
  disabled: boolean;
  name?: string;
  createNewCollection: boolean;
  collection?: string;
  contents?: string;
} {
  return {
    error: undefined,
    disabled: false,
    name: undefined,
    createNewCollection: false,
    collection: undefined,
    contents: undefined,
  };
}

const props = defineProps<{
  envId: string;
  collections: Array<string>;
}>();

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

function open() {
  Object.assign(state, initialData());
  if (props.collections.length > 0) {
    state.collection = props.collections[0];
  } else {
    state.createNewCollection = true;
  }
  modal.value?.open();
}

function close() {
  modal.value?.close();
}

async function submit() {
  if (!state.collection || !state.name || !state.contents) {
    return;
  }
  try {
    state.disabled = true;
    state.error = null;
    await store?.collections.secrets.createItem({
      env_id: props.envId,
      collection: state.collection,
      name: state.name,
      contents: state.contents,
    });
    modal.value?.close();
  } catch (error) {
    state.error = error;
    state.disabled = false;
  }
}

defineExpose({ open, close });
</script>
