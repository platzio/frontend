<template>
  <div v-if="config">
    <div v-if="uiSchema">
      <div v-for="input in uiSchema.inputs" :key="input.id" class="mt-2">
        <ConfigValue
          :input="input"
          :envId="envId"
          :value="config[input.id]"
          :allValues="config"
        />
      </div>
    </div>

    <div v-else>
      <YamlContent :config="config" />
    </div>
  </div>

  <div class="my-3" v-if="valuesOverride && Object.keys(valuesOverride).length">
    <YamlContent header="Values Override" :config="valuesOverride" />
  </div>
</template>

<script setup lang="ts">
import { type UiSchema } from "@platzio/sdk";
import ConfigValue from "@/components/values/ConfigValue.vue";
import YamlContent from "./YamlContent.vue";

defineProps<{
  envId: string;
  uiSchema?: UiSchema | null;
  config: Record<string, any>;
  valuesOverride?: Object;
}>();
</script>
