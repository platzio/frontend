<template>
  <div v-if="hasNewVersion" class="newer-version">
    <button
      class="alert alert-success py-2"
      :disabled="reloading"
      @click="reload"
    >
      <div>
        <FaIcon icon="gift" fixed-width />
        New UI Version Available
      </div>
      <div class="fw-bold">Click here to upgrade</div>
    </button>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { computed, onBeforeUnmount, ref } from "vue";

const CHECK_INTERVAL = 60 * 1000;

let timer: number;
const prev = ref<string | undefined>();
const current = ref<string | undefined>();
const reloading = ref(false);

const check = async () => {
  try {
    const res = await axios.get("/");
    prev.value = current.value;
    current.value = res.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    /* nothing to do */
  }
  timer = window.setTimeout(check, CHECK_INTERVAL);
};

const reload = () => {
  reloading.value = true;
  window.clearTimeout(timer);
  window.location.reload();
};

check();

onBeforeUnmount(() => window.clearTimeout(timer));

const hasNewVersion = computed(
  () => prev.value && current.value && prev.value !== current.value
);
</script>

<style lang="scss" scoped>
.newer-version {
  position: absolute;
  top: 2rem;
  margin-left: 50%;
  transform: translate(-50%);
  text-align: center;
  font-size: 0.9rem;
}
</style>
