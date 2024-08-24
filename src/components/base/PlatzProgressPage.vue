<template>
  <div class="vh-100 d-flex justify-content-center align-items-center">
    <div class="d-flex flex-column align-items-center">
      <div>
        <PlatzAntStacking size="20rem" />
      </div>
      <div
        class="my-3 progress"
        style="width: 17rem; height: 9px"
        v-if="!error"
      >
        <div
          class="progress-bar bg-danger"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :style="{ width: `${progress}%` }"
          :class="{
            'progress-bar-striped progress-bar-animated': animateProgress,
          }"
          :aria-valuenow="progress"
        />
      </div>
      <div class="status" :class="{ 'show-status': !!text }" v-if="!error">
        {{ text }}
      </div>
      <PlatzError class="my-3" :error="error" v-else />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.status {
  color: var(--bs-secondary);
  transform: scaleY(0);
  transition: transform 0.2s ease-in-out;
  transform-origin: top center;
}

.show-status {
  transform: scaleY(1);
}
</style>

<script setup lang="ts">
import PlatzAntStacking from "@platzio/design/components/PlatzAntStacking.vue";
import PlatzError from "./PlatzError.vue";

withDefaults(
  defineProps<{
    progress: number;
    animateProgress?: boolean;
    text?: string;
    error?: Error;
  }>(),
  {
    progress: 0,
    animateProgress: false,
  }
);
</script>
