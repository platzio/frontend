<template>
    <div class="sidenav">
        <ul class="nav nav-pills flex-column">
            <li class="h5 ms-3">
                <PlatzEnv :id="envId" :showInfo="false" />
            </li>
            <li class="nav-heading">Permissions</li>
            <li class="nav-item">
                <router-link
                    class="nav-link"
                    :to="{ name: 'env.settings.deployment-permissions' }"
                >
                    Deployments
                </router-link>
            </li>
            <li class="nav-item">
                <router-link
                    class="nav-link"
                    :to="{ name: 'env.settings.user-roles' }"
                >
                    Users
                </router-link>
            </li>
            <li class="nav-heading">Secrets</li>
            <li class="nav-item">
                <router-link
                    class="nav-link"
                    :to="{ name: 'env.settings.secrets' }"
                >
                    Manage Secrets
                </router-link>
            </li>
        </ul>
        <div class="content">
            <router-view :envId="envId" />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useHead } from "@vueuse/head";
import { useStore } from "@/store";
import PlatzEnv from "@/components/PlatzEnv.vue";

export default defineComponent({
    components: {
        PlatzEnv,
    },

    props: {
        envId: {
            type: String,
            required: true,
        },
    },

    setup(props) {
        const store = useStore();
        const env = computed(() => store!.collections.envs.getOne(props.envId));

        useHead({
            title: computed(() => `Settings - ${env.value.name} - Platz`),
        });

        return {};
    },
});
</script>
