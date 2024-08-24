<template>
  <div v-if="env">
    <div class="mt-0 mb-3 h3">
      <PlatzEnv :id="env.id" />
    </div>

    <div class="my-3">
      <div class="card">
        <div class="card-body">
          <div class="mb-1 d-flex flex-row align-items-start">
            <div class="flex-fill">
              <template v-if="numAdmins === 0">
                <div class="mb-1 fw-bold">
                  <FaIcon icon="triangle-exclamation" fixed-width />
                  It looks like this env has no admins
                </div>
                <div>
                  Add yourself or another user as an env admin to control env
                  users, deployment permissions and env secrets.
                </div>
              </template>
              <template v-else>
                <div class="mb-1">
                  As a site admin, you can manage users for all envs.
                </div>
                <div>
                  If you don't want to see an env in the env switcher, you can
                  remove yourself from the env and always add yourself later.
                </div>
              </template>
            </div>
            <router-link
              class="px-3 btn btn-sm btn-outline-primary"
              :to="{
                name: 'env.settings.user-roles',
                params: { envId },
              }"
            >
              Manage Env Users
              <FaIcon icon="angle-right" fixed-width />
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="my-3">
      <div class="card">
        <div class="card-body">
          <div class="mb-1 d-flex flex-row align-items-start">
            <div class="flex-fill">
              <span class="me-1 badge bg-success" v-if="env.auto_add_new_users"
                >ON</span
              >
              <span class="me-1 badge bg-danger" v-else>OFF</span>
              Automatically add new users to this env
            </div>
            <button
              class="px-3 btn btn-sm btn-outline-primary"
              @click="editAutoAddNewUsers && editAutoAddNewUsers.open(env)"
            >
              Edit
            </button>
          </div>

          <div class="text-secondary">
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
            <div class="text-secondary flex-fill">
              These settings control the nodes on which env deployments can run
              on. Note that once changed, all deployments of this env are
              automatically redeployed.
            </div>
            <button
              class="ms-1 px-3 btn btn-sm btn-outline-primary"
              @click="editNodeSelector && editNodeSelector.open(env)"
            >
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

<script setup lang="ts">
import { computed, ref } from "vue";
import { useHead } from "@vueuse/head";
import yaml from "js-yaml";
import { EnvUserRole } from "@platzio/sdk";
import { useStore } from "@/store";
import PlatzEnv from "@/components/PlatzEnv.vue";
import EditNodeSelector from "./EditNodeSelector.vue";
import EditAutoAddNewUsers from "./EditAutoAddNewUsers.vue";

const props = defineProps<{
  envId: string;
}>();

const store = useStore();
const editNodeSelector = ref<typeof EditNodeSelector>();
const editAutoAddNewUsers = ref<typeof EditAutoAddNewUsers>();
const env = computed(() => store!.collections.envs.getOne(props.envId));

const numAdmins = computed(
  () =>
    store!.collections.envUserPermissions
      .allForEnv(props.envId)
      .filter((permission) => permission.role === EnvUserRole.Admin).length
);

useHead({
  title: computed(() => `${env.value?.name || "..."} - Envs - Admin - Platz`),
});

const nodeSelector = computed(() =>
  yaml.dump(env.value?.node_selector).trimEnd()
);
const tolerations = computed(() => yaml.dump(env.value?.tolerations).trimEnd());
</script>
