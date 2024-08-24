import { type DeploymentKind, type UpdateDeploymentKind } from "@platzio/sdk";
import { createCollection } from "./collection";

export type DeploymentKindsCollection = ReturnType<
  typeof createCollection<
    DeploymentKind,
    void,
    DeploymentKind,
    UpdateDeploymentKind
  >
>;

export const createDeploymentKindsCollection = () =>
  createCollection<DeploymentKind, void, DeploymentKind, UpdateDeploymentKind>({
    url: "/api/v2/deployment-kinds",

    sortFunc(x, y) {
      return y.created_at.localeCompare(x.created_at);
    },

    formatItem: (item: DeploymentKind) => ({
      inputLabel: false,
      icon: "swatchbook",
      text: item.name,
    }),
  });
