<template>
    <div v-if="ready">
        <PlatzCollection :items="allUserTokens">
            <template #item="scope">
                <PlatzItemWithActions>
                    <template #contents>
                        <div class="my-1">
                            <FaIcon icon="key" fixed-width />
                            <samp class="ms-1 lead">{{ scope.item.id }}</samp>
                        </div>
                        <div class="my-1 small">
                            Created
                            <PlatzMoment :value="scope.item.created_at" />
                        </div>
                    </template>
                    <template #actions>
                        <li>
                            <a
                                class="dropdown-item"
                                @click="
                                    revokeUserToken &&
                                        revokeUserToken.open(scope.item)
                                "
                            >
                                <FaIcon icon="xmark" fixed-width />
                                Revoke User Token
                            </a>
                        </li>
                    </template>
                </PlatzItemWithActions>
            </template>

            <template #global-actions>
                <div
                    class="d-flex flex-row align-items-center justify-content-end"
                >
                    <button
                        class="btn btn-primary"
                        @click="newUserToken && newUserToken.open()"
                    >
                        <FaIcon icon="plus" fixed-width />
                        Create User Token
                    </button>
                </div>
            </template>

            <template #empty-title>You have no user tokens</template>
            <template #empty-text>
                <button
                    class="btn btn-lg btn-primary"
                    @click="newUserToken && newUserToken.open()"
                >
                    <FaIcon icon="plus" fixed-width />
                    Create User Token
                </button>
            </template>
        </PlatzCollection>
    </div>
    <div v-else class="my-3 h2 text-center text-body-secondary">
        <FaIcon icon="circle-notch" spin fixed-width />
    </div>
    <NewUserToken ref="newUserToken" @submit="reload" @close="reload" />
    <RevokeUserToken ref="revokeUserToken" @submit="reload" @close="reload" />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import PlatzMoment from "@/components/base/PlatzMoment.vue";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzItemWithActions from "@/components/collection/PlatzItemWithActions.vue";
import { useStore } from "@/store";
import { CollectionFilters } from "@/store/models/collection";
import NewUserToken from "./NewUserToken.vue";
import RevokeUserToken from "./RevokeUserToken.vue";
import { userTokens } from "./collection";

export default defineComponent({
    components: {
        PlatzMoment,
        PlatzCollection,
        PlatzItemWithActions,
        NewUserToken,
        RevokeUserToken,
    },

    props: {
        userId: {
            type: String,
            required: false,
        },
    },

    setup(props) {
        const newUserToken = ref<typeof NewUserToken>();
        const revokeUserToken = ref<typeof RevokeUserToken>();
        const store = useStore();
        const curUser = computed(() => store!.auth.curUser!);
        const user = computed(() =>
            props.userId
                ? store!.collections.users.getOne(props.userId)
                : curUser.value
        );

        const userTokenFilters: CollectionFilters =
            curUser.value.id == user.value.id ? {} : { user_id: user.value.id };

        const reload = () => {
            userTokens.reset();
            userTokens.setFilters(userTokenFilters);
        };

        const ready = computed(() => userTokens.ready);

        userTokens.init();

        const allUserTokens = computed(() => userTokens.all);

        return {
            user,
            curUser,
            allUserTokens,
            ready,
            reload,
            newUserToken,
            revokeUserToken,
        };
    },
});
</script>
