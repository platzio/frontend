<template>
  <PlatzModal
    ref="modal"
    title="Add Secret"
    size="lg"
    btn-class="btn-primary"
    :error="error"
    :working="disabled"
    @submit="submit"
  >
    <div class="mb-3">
      <div class="my-2 form-check">
        <input
          class="form-check-input"
          type="radio"
          name="whichCollection"
          id="useExistingCollection"
          v-model="createNewCollection"
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
          v-model="createNewCollection"
          :value="true"
        />
        <label class="form-check-label" for="createNewCollection">
          Create secret in a new collection
        </label>
      </div>
    </div>

    <div class="mb-3 form-floating" v-if="!createNewCollection">
      <select
        class="form-select"
        id="collection"
        v-model="collection"
        :disabled="disabled"
        required
      >
        <option v-for="option in collections" :key="option" :value="option">
          {{ option }}
        </option>
        <option class="opacity-50" disabled>---------------------------</option>
        <option :value="null">Create a new collection</option>
      </select>
      <label>Collection</label>
    </div>

    <div class="mb-3 form-floating" v-if="createNewCollection">
      <input
        type="text"
        class="form-control"
        id="collection"
        v-model="collection"
        required
        :disabled="disabled"
      />
      <label class="form-label">Collection Name</label>
    </div>

    <div class="mb-3 form-floating">
      <input
        type="text"
        class="form-control"
        id="name"
        v-model="name"
        required
        :disabled="disabled"
      />
      <label class="form-label">Secret Name</label>
    </div>

    <div class="mb-3 form-floating">
      <input
        type="contents"
        class="form-control"
        id="contents"
        v-model="contents"
        required
        :disabled="disabled"
        autocomplete="off"
        spellcheck="false"
        autocapitalize="off"
      />
      <label class="form-label">Contents</label>
    </div>
  </PlatzModal>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref, toRefs } from "vue";
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

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
    collections: {
      type: Array as PropType<Array<string>>,
      required: true,
    },
  },

  components: {
    PlatzModal,
  },

  setup(props) {
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
      modal.value!.open();
    }

    function close() {
      modal.value!.close();
    }

    async function submit() {
      try {
        state.disabled = true;
        state.error = null;
        await store!.collections.secrets.createItem({
          env_id: props.envId,
          collection: state.collection,
          name: state.name,
          contents: state.contents,
        });
        modal.value!.close();
      } catch (error) {
        state.error = error;
        state.disabled = false;
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
