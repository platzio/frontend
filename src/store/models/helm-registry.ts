import { HelmRegistry, UpdateHelmRegistry } from "@platzio/sdk";
import { createCollection } from "./collection";
import { useStore } from "..";

export type HelmRegistriesCollection = ReturnType<
    typeof createCollection<
        HelmRegistry,
        void,
        HelmRegistry,
        UpdateHelmRegistry
    >
>;

export const createHelmRegistriesCollection = () =>
    createCollection<HelmRegistry, void, HelmRegistry, UpdateHelmRegistry>({
        url: "/api/v2/helm-registries",

        sortFunc(x, y) {
            return (
                x.domain_name.localeCompare(y.domain_name) ||
                x.repo_name.localeCompare(y.repo_name)
            );
        },

        formatItem: (item: HelmRegistry) => ({
            icon: "box",
            text: `${item.domain_name}/${item.repo_name}`,
        }),
    });

export function allKinds(): string[] {
    const store = useStore();
    return Array.from(
        new Set(
            store!.collections.helmRegistries.all.map(
                (registry) => registry.kind
            )
        )
    ).sort();
}
