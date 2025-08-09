<template>
  <div :id="id" class="modal fade" tabindex="-1">
    <div class="modal-dialog" :class="dialogClasses">
      <div class="modal-content text-start">
        <form @submit="submit">
          <div class="modal-header">
            <h5 :id="`${id}Label`" class="modal-title">
              {{ title }}
            </h5>
            <button
              type="button"
              class="btn-close"
              :disabled="working"
              @click="close"
            />
          </div>

          <div class="modal-body">
            <PlatzError :error="topError" />
            <slot />
            <PlatzError :error="error" />
          </div>

          <div class="modal-footer">
            <button
              v-if="showCancel"
              type="button"
              class="btn btn-link"
              :disabled="working"
              @click="close"
            >
              {{ cancelText }}
            </button>
            <button
              v-if="showSubmit"
              type="submit"
              :class="['btn', btnClass]"
              :disabled="working"
            >
              {{ submitText || title }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import PlatzError from "./PlatzError.vue";

const props = withDefaults(
  defineProps<{
    title: string;
    size?: "sm" | "lg";
    showSubmit?: boolean;
    submitText?: string;
    showCancel?: boolean;
    cancelText?: string;
    topError?: Error;
    error?: Error;
    working?: boolean;
    btnClass?: string;
  }>(),
  {
    size: undefined,
    showSubmit: true,
    submitText: undefined,
    showCancel: true,
    cancelText: "Cancel",
    topError: undefined,
    error: undefined,
    working: false,
    btnClass: "btn-primary",
  }
);

const emit = defineEmits(["submit", "close"]);

const id = ref(`modal${Math.round(Math.random() * 10000000000000000)}`);
const modal = ref<Modal>();

const dialogClasses = computed(() => (props.size ? `modal-${props.size}` : ""));

onMounted(() => {
  const elem = document.getElementById(id.value);
  if (!elem) {
    throw new Error(`Expected element with ID ${id.value}`);
  }
  modal.value = new Modal(elem);
});

function open() {
  if (modal.value) {
    return modal.value.show();
  }
}

function close() {
  if (modal.value) {
    modal.value.hide();
    emit("close");
  }
}

function submit(event: Event) {
  event.preventDefault();
  emit("submit");
}

defineExpose({ open, close });
</script>
