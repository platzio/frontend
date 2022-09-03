<template>
  <PlatzModal
    ref="modal"
    size="lg"
    :title="title"
    :submit-text="submitText"
    :error="error"
    :working="disabled"
    @submit="submit"
  >
    <ResourceForm
      :current-data="current"
      :disabled="disabled"
      :envId="envId"
      :resourceTypeId="resourceTypeId"
      ref="form"
    />
  </PlatzModal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from "vue";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { useStore } from "@/store";
import { DeploymentResource } from "@/store/models/deployment-resource";
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

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
    resourceTypeId: {
      type: String,
      required: true,
    },
  },

  components: {
    PlatzModal,
    ResourceForm,
  },

  setup(props) {
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

    const submitText = computed(() => (state.current.id ? "Save Changes" : title.value));

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

    return {
      modal,
      form,
      title,
      submitText,
      open,
      close,
      submit,
      ...toRefs(state),
    };
  },
});
</script>
