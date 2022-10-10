import { EnvUserRole } from "./models/env-user-permission";
import { UserDeploymentRole } from "./models/deployment-permission";
import { useStore } from ".";
import { User } from "./models/user";

export function isEnvUser(envId: string, user: User) {
    const store = useStore();
    return (
        user.is_admin ||
        store!.collections.envUserPermissions.all.some(
            (permission) =>
                permission.env_id == envId && permission.user_id == user.id
        )
    );
}

export function isEnvAdmin(envId: string, user: User) {
    const store = useStore();
    return (
        user.is_admin ||
        store!.collections.envUserPermissions.all.some(
            (permission) =>
                permission.env_id == envId &&
                permission.user_id == user.id &&
                permission.role == EnvUserRole.Admin
        )
    );
}

export function isDeploymentOwner(envId: string, kind: string) {
    const store = useStore();
    const curUser = store!.auth.curUser!;
    return (
        isEnvAdmin(envId, curUser) ||
        store!.collections.deploymentPermissions.all.some(
            (permission) =>
                permission.env_id == envId &&
                permission.kind == kind &&
                permission.user_id == curUser.id &&
                permission.role == UserDeploymentRole.Owner
        )
    );
}

export function isDeploymentMaintainer(envId: string, kind: string) {
    const store = useStore();
    const curUser = store!.auth.curUser!;
    return (
        isEnvAdmin(envId, curUser) ||
        store!.collections.deploymentPermissions.all.some(
            (permission) =>
                permission.env_id == envId &&
                permission.kind == kind &&
                permission.user_id == curUser.id &&
                [
                    UserDeploymentRole.Owner,
                    UserDeploymentRole.Maintainer,
                ].indexOf(permission.role) != -1
        )
    );
}
