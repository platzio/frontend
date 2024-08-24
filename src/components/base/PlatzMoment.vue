<template>
  <span v-if="fromNow">{{ fromNowFmt }}</span>
  <span v-if="absolute" class="text-body-secondary ms-1"
    >({{ absoluteFmt }})</span
  >
</template>

<script setup lang="ts">
import moment from "moment";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    value: string;
    fromNow?: boolean;
    absolute?: boolean;
  }>(),
  {
    fromNow: true,
    absolute: true,
  }
);

const _moment = computed(() => moment(props.value));
const fromNowFmt = computed(() => _moment.value.fromNow());
const absoluteFmt = computed(() => _moment.value.format("LLL"));
</script>
