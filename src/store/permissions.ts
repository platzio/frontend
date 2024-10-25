import { EnvUserRole, type User, UserDeploymentRole } from "@platzio/sdk";
import type { Store } from ".";

export function isEnvUser(store: Store, envId: string, user: User) {
  return (
    user.is_admin ||
    store.collections.envUserPermissions.all.some(
      (permission) =>
        permission.env_id == envId && permission.user_id == user.id
    )
  );
}

export function isEnvAdmin(store: Store, envId: string, user: User) {
  return (
    user.is_admin ||
    store.collections.envUserPermissions.all.some(
      (permission) =>
        permission.env_id == envId &&
        permission.user_id == user.id &&
        permission.role == EnvUserRole.Admin
    )
  );
}

export function isDeploymentOwner(
  store: Store,
  envId: string,
  kind_id: string
) {
  const curUser = store.auth.curUser;
  return (
    curUser &&
    (isEnvAdmin(store, envId, curUser) ||
      store.collections.deploymentPermissions.all.some(
        (permission) =>
          permission.env_id == envId &&
          permission.kind_id == kind_id &&
          permission.user_id == curUser.id &&
          permission.role == UserDeploymentRole.Owner
      ))
  );
}

export function isDeploymentMaintainer(
  store: Store,
  envId: string,
  kind_id: string
) {
  const curUser = store.auth.curUser;
  return (
    curUser &&
    (isEnvAdmin(store, envId, curUser) ||
      store.collections.deploymentPermissions.all.some(
        (permission) =>
          permission.env_id == envId &&
          permission.kind_id == kind_id &&
          permission.user_id == curUser.id &&
          [UserDeploymentRole.Owner, UserDeploymentRole.Maintainer].indexOf(
            permission.role
          ) != -1
      ))
  );
}
