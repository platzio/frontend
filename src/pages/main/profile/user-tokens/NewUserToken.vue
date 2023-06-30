<template>
    <PlatzModal
        ref="modal"
        size="lg"
        title="New User Token"
        :error="error"
        :working="working"
        btn-class="btn-success"
        :showSubmit="false"
        cancelText="Close"
    >
        <div v-if="working" class="my-3 h2 text-center text-body-secondary">
            <FaIcon icon="circle-notch" spin fixed-width />
        </div>
        <div v-else-if="createdToken">
            <div class="mb-2">Here's your new user token:</div>
            <div class="mt-3 mb-2 user-token">
                <samp>{{ createdToken.created_token }}</samp>
            </div>
            <div class="mt-2 mb-3 small text-body-secondary">
                <FaIcon icon="exclamation-triangle" fixed-width />
                Make sure to copy your user token, you may never retreive it
                again through Platz.
            </div>
            <div class="mt-4 mb-2 h5 fw-bold">Using in CLI</div>
            <div class="my-2">
                Store your user token in
                <code>~/.config/platz/config.toml</code>:
            </div>
            <pre
                class="my-2 p-3 rounded border bg-dark text-light"
                style="font-size: 1.1rem"
            ><code>[profile.default]
url = "{{ server_url }}"
user_token = "{{ createdToken.created_token }}"
default_profile = true</code></pre>
            <div class="mt-4 mb-2 h5 fw-bold">Using in API Calls</div>
            <div class="my-2">
                Alternatively, you can use your new token by passing it in the
                <code>x-platz-token</code> header of API calls, for example:
            </div>
            <pre
                class="my-2 p-3 rounded border bg-dark text-light"
                style="font-size: 1.1rem"
            ><code style="word-wrap: break-word">curl -H 'x-platz-token: {{ createdToken.created_token }}' {{ server_url }}/api/v2/auth/me</code></pre>
        </div>
    </PlatzModal>
</template>

<style lang="scss" scoped>
.user-token {
    font-size: 1.35rem;
    border: 2px dashed var(--bs-success);
    color: var(--bs-success);
    background-color: var(--bs-light);
    border-radius: 0.25rem;
    padding: 0.5rem;
    text-align: center;
    word-wrap: break-word;
    word-break: break-all;
}
</style>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { userTokens } from "./collection";
import { CreatedUserToken } from "@platzio/sdk";

function initialData(): {
    error: any;
    working: boolean;
    createdToken?: CreatedUserToken;
} {
    return {
        error: undefined,
        working: true,
        createdToken: undefined,
    };
}

export default defineComponent({
    components: {
        PlatzModal,
    },

    setup() {
        const state = reactive({ ...initialData() });
        const modal = ref<typeof PlatzModal>();
        const server_url = ref(`${location.protocol}//${location.host}`);

        async function open() {
            Object.assign(state, initialData());
            modal.value!.open();
            try {
                state.createdToken = await userTokens.createItem({});
            } catch (err) {
                state.error = err;
            }
            state.working = false;
        }

        function close() {
            modal.value!.close();
        }

        return {
            modal,
            server_url,
            open,
            close,
            ...toRefs(state),
        };
    },
});
</script>
