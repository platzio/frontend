<template>
  <div>
    <div class="mt-0 h3">
      <Env :id="env.id" />
    </div>

    <div class="my-3">
      <div class="card">
        <div class="card-body">
          <div class="mb-3 d-flex flex-row align-items-start">
            <div>
              <span class="me-2 badge bg-success" v-if="env.auto_add_new_users">ON</span>
              <span class="me-2 badge bg-danger" v-else>OFF</span>
              Automatically add new users to this env
            </div>
            <button class="btn btn-outline-primary" @click="editAutoAddNewUsers && editAutoAddNewUsers.open(env)">
              Change
            </button>
          </div>

          <div class="mb-3">
            When enabled, new users signing into Platz will be added to this env
            automatically. New users are added with the User role and be
            upgraded to Admins manually.
          </div>
        </div>
      </div>
    </div>

    <div class="my-3">
      <div class="card">
        <div class="card-body">
          <div class="mb-4 d-flex flex-row align-items-start">
            <div class="text-secondary">
              These settings control the nodes on which env deployments can run
              on. Note that once changed, all deployments of this env are
              automatically redeployed.
            </div>
            <button class="btn btn-outline-primary" @click="editNodeSelector && editNodeSelector.open(env)">
              Edit
            </button>
          </div>
          <div class="mt-4 mb-2 fw-bold">
            Node Selector
            <span class="ms-1 badge bg-secondary">YAML</span>
          </div>
          <pre class="m-0">{{ nodeSelector }}</pre>
          <div class="mt-4 mb-2 fw-bold">
            Tolerations
            <span class="ms-1 badge bg-secondary">YAML</span>
          </div>
          <pre class="m-0">{{ tolerations }}</pre>
        </div>
      </div>
    </div>

    <EditNodeSelector ref="editNodeSelector" :envId="envId" />
    <EditAutoAddNewUsers ref="editAutoAddNewUsers" :envId="envId" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useHead } from "@vueuse/head";
import { useStore } from "@/store";
import yaml from "js-yaml";
import EditNodeSelector from "./EditNodeSelector.vue";
import EditAutoAddNewUsers from './EditAutoAddNewUsers.vue'

export default defineComponent({
  props: {
    envId: {
      required: true,
      type: String,
    },
  },

  components: {
    EditNodeSelector,
    EditAutoAddNewUsers,
  },

  setup(props) {
    const store = useStore();
    const editNodeSelector = ref<typeof EditNodeSelector>();
    const editAutoAddNewUsers = ref<typeof EditAutoAddNewUsers>()
    const env = computed(() => store!.collections.envs.getOne(props.envId));

    useHead({
      title: computed(() => `${env.value.name} - Envs - Admin - Platz`),
    });

    const nodeSelector = computed(() =>
      yaml.dump(env.value.node_selector).trimEnd()
    );
    const tolerations = computed(() =>
      yaml.dump(env.value.tolerations).trimEnd()
    );

    return {
      env,
      nodeSelector,
      tolerations,
      editNodeSelector,
      editAutoAddNewUsers,
    };
  },
});
</script>
