<template>
    <ProfileNavbar />
    <div class="sidenav">
        <ul class="nav nav-pills flex-column">
            <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'profile.you' }">
                    <FaIcon icon="child-reaching" fixed-width /> You
                </router-link>
            </li>
            <li class="nav-heading">Authentication</li>
            <li class="nav-item">
                <router-link
                    class="nav-link"
                    :to="{ name: 'profile.user-tokens' }"
                >
                    User Tokens
                </router-link>
            </li>
        </ul>
        <div class="content">
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useHead } from "@vueuse/head";
import { useStore } from "@/store";
import ProfileNavbar from "./ProfileNavbar.vue";

export default defineComponent({
    components: {
        ProfileNavbar,
    },

    props: {
        userId: {
            type: String,
            required: false,
        },
    },

    setup(props) {
        useHead({
            title: "Profile - Platz",
        });
        const store = useStore();

        const curUser = computed(() => store!.auth.curUser!);

        return {
            curUser,
        };
    },
});
</script>
