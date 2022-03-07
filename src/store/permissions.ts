import { EnvUserRole } from './models/env-user-permission'
import { UserDeploymentRole } from './models/deployment-permission';
import { useStore } from '.'

export function isEnvUser(envId: string, userId: string) {
    const store = useStore()
    return store!.collections.envUserPermissions.all.some(
        permission =>
            permission.env_id == envId &&
            permission.user_id == userId
    )
}

export function isEnvAdmin(envId: string, userId: string) {
    const store = useStore()
    return store!.collections.envUserPermissions.all.some(
        permission =>
            permission.env_id == envId &&
            permission.user_id == userId &&
            permission.role == EnvUserRole.Admin
    )
}

export function isDeploymentOwner(envId: string, kind: string) {
    const store = useStore()
    const curUserId = store!.auth.curUser!.id
    return isEnvAdmin(envId, curUserId) || store!.collections.deploymentPermissions.all.some(
        permission =>
            permission.env_id == envId &&
            permission.kind == kind &&
            permission.user_id == curUserId &&
            permission.role == UserDeploymentRole.Owner
    )
}

export function isDeploymentMaintainer(envId: string, kind: string) {
    const store = useStore()
    const curUserId = store!.auth.curUser!.id
    return isEnvAdmin(envId, curUserId) || store!.collections.deploymentPermissions.all.some(
        permission =>
            permission.env_id == envId &&
            permission.kind == kind &&
            permission.user_id == curUserId &&
            [UserDeploymentRole.Owner, UserDeploymentRole.Maintainer].indexOf(permission.role) != -1
    )
}
