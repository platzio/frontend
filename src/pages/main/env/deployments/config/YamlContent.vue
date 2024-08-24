<template>
  <div class="card" v-if="header">
    <div class="small card-header">
      <div
        class="my-1 d-flex flex-row justify-content-between align-items-start"
      >
        <div>
          <div>
            {{ header }}
          </div>
          <div class="small opacity-75" v-if="timestamp">
            Updated
            <PlatzMoment :value="timestamp" />
          </div>
        </div>
        <span class="ms-1 badge border text-dark-emphasis">YAML</span>
      </div>
    </div>
    <div class="card-body">
      <pre class="m-0">{{ configYaml }}</pre>
    </div>
  </div>
  <div v-else>
    <div
      v-for="(line, i) in configYaml.split('\n')"
      :key="i"
      class="my-2"
      style="white-space: pre"
    >
      {{ line }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import yaml from "js-yaml";
import PlatzMoment from "@/components/base/PlatzMoment.vue";

const props = defineProps<{
  config: Record<string, any>;
  header?: string;
  timestamp?: string;
}>();

const configYaml = computed(() => yaml.dump(props.config));
</script>
