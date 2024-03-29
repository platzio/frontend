<template>
    <div>
        <ul class="list-group">
            <li class="list-group-item bg-light-subtle">
                <div class="row">
                    <div class="col-3 py-2 px-3" />
                    <div
                        class="col py-2 px-3 fw-bold"
                        v-for="role in UserDeploymentRole"
                        :key="role"
                    >
                        {{ role }}s
                    </div>
                </div>
            </li>
            <li
                class="list-group-item"
                v-for="kind in deploymentKinds"
                :key="kind"
            >
                <div class="row">
                    <div class="col-3 py-2 px-3 fw-bold">{{ kind }}</div>
                    <div
                        class="col py-2 px-3"
                        v-for="role in UserDeploymentRole"
                        :key="role"
                    >
                        <div
                            v-for="permission in permissionsByRole(kind, role)"
                            :key="permission.id"
                            class="mb-2 d-flex flex-row align-items-end"
                        >
                            <PlatzUser
                                :id="permission.user_id"
                                :show-name="true"
                            />
                            <a
                                v-if="canEdit"
                                class="small ms-2"
                                @click="
                                    removeUser &&
                                        removeUser.open(kind, role, permission)
                                "
                            >
                                remove
                            </a>
                        </div>
                        <a
                            v-if="canEdit"
                            class="small"
                            @click="addUser && addUser.open(kind, role)"
                        >
                            <FaIcon icon="plus" fixed-width />
                            Add User
                        </a>
                    </div>
                </div>
            </li>
        </ul>

        <AddUserDeploymentPermission ref="addUser" :envId="envId" />
        <RemoveUserDeploymentPermission ref="removeUser" />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useHead } from "@vueuse/head";
import { UserDeploymentRole } from "@platzio/sdk";
import PlatzUser from "@/components/PlatzUser.vue";
import { useStore } from "@/store";
import { isEnvAdmin } from "@/store/permissions";
import { allKinds } from "@/store/models/helm-registry";
import AddUserDeploymentPermission from "./AddUserDeploymentPermission.vue";
import RemoveUserDeploymentPermission from "./RemoveUserDeploymentPermission.vue";

export default defineComponent({
    components: {
        PlatzUser,
        AddUserDeploymentPermission,
        RemoveUserDeploymentPermission,
    },

    props: {
        envId: {
            type: String,
            required: true,
        },
    },

    setup(props) {
        const store = useStore();
        const addUser = ref<typeof AddUserDeploymentPermission>();
        const removeUser = ref<typeof RemoveUserDeploymentPermission>();

        const env = computed(() => store!.collections.envs.getOne(props.envId));

        const deploymentKinds = computed(allKinds);

        const permissionsByRole = computed(
            () => (kind: string, role: UserDeploymentRole) =>
                store!.collections.deploymentPermissions.all.filter(
                    (perm) =>
                        perm.env_id == props.envId &&
                        perm.kind == kind &&
                        perm.role == role
                )
        );

        const canEdit = computed(() =>
            isEnvAdmin(props.envId, store!.auth.curUser!)
        );

        useHead({
            title: computed(
                () =>
                    `Deployments Permissions - Settings - ${env.value.name} - Platz`
            ),
        });

        return {
            addUser,
            removeUser,
            UserDeploymentRole,
            deploymentKinds,
            permissionsByRole,
            canEdit,
        };
    },
});
</script>
