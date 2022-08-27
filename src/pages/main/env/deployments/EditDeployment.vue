<template>
  <PlatzModal
    ref="modal"
    size="lg"
    :title="title"
    :submit-text="submitText"
    :topError="topError"
    :error="bottomError"
    :working="working"
    @submit="submit"
  >
    <DeploymentForm :envId="envId" :current-data="current" :working="working" ref="form" />
  </PlatzModal>
</template>

<script lang="ts">
import PlatzModal from "@/components/base/PlatzModal.vue";
import { useStore } from "@/store";
import { Deployment } from "@/store/models/deployment";
import { cloneDeep } from "lodash";
import { defineComponent, reactive, ref, toRefs } from "vue";
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

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
  },

  components: {
    PlatzModal,
    DeploymentForm,
  },

  setup() {
    const store = useStore();
    const state = reactive(initialData());
    const modal = ref<typeof PlatzModal>();
    const form = ref<typeof DeploymentForm>();

    function openForCreate(kind: string) {
      Object.assign(state, initialData());
      state.current = cloneDeep({ kind });
      modal.value!.open();
    }

    function openForEdit(current: Partial<Deployment>) {
      Object.assign(state, initialData());
      state.current = cloneDeep(current);
      state.title = "Edit Deployment";
      state.submitText = "Save Changes";
      modal.value!.open();
    }

    function openForCloneFrom(from: Partial<Deployment>) {
      Object.assign(state, initialData());
      state.current = cloneDeep(from);
      state.title = `Create Deployment Based On ${state.current.name!}`;
      state.current.id = undefined;
      state.current.name = undefined;
      modal.value!.open();
    }

    async function submitWithoutOpening(current: Partial<Deployment>) {
      Object.assign(state, initialData());
      state.current = cloneDeep(current);
      try {
        state.working = true;
        state.topError = null;
        state.bottomError = null;
        await store!.collections.deployments.updateItem({
          id: state.current.id!,
          data: state.current,
        });
      } catch (error) {
        state.topError = error;
        state.bottomError = null;
        state.working = false;
        modal.value!.open();
      }
    }

    function close() {
      modal.value!.close();
    }

    async function submit() {
      try {
        state.working = true;
        state.bottomError = null;
        await form.value!.save();
        close();
      } catch (error) {
        state.bottomError = error;
        state.working = false;
      }
    }

    return {
      modal,
      form,
      openForCreate,
      openForEdit,
      openForCloneFrom,
      close,
      submit,
      submitWithoutOpening,
      ...toRefs(state),
    };
  },
});
</script>
