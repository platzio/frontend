<template>
    <div>
        <div class="d-flex flex-row align-items-start">
            <div class="mt-0 flex-fill h4 fw-bold">Helm Tag Formats</div>
            <div>
                <button
                    class="btn btn-primary"
                    role="button"
                    @click="addTagFormat && addTagFormat.open()"
                >
                    <FaIcon icon="plus" fixed-width />
                    Add Tag Format
                </button>
            </div>
        </div>

        <div class="my-4">
            <div class="my-3">
                The formats below are how Helm chart tags are parsed into
                version, revision, Git branch and commit.
            </div>

            <div class="my-3">
                You can add new tag formats, which triggers a parsing of all
                existing Helm charts. Tag format patterns are Perl-style regular
                expressions that may contain the following named groups:
                <strong>version</strong>, <strong>revision</strong>,
                <strong>branch</strong> and <strong>commit</strong>. If a named
                group is missing from the pattern, it will be stored as an empty
                string in case the rest of the pattern successfully matches the
                image tag.
            </div>

            <div class="my-3">
                When trying to parse a Helm tag, formats are tested by their
                creation time from newest to oldest. This means that if you add
                a new tag format it may potentially supersede existing tag
                formats.
            </div>

            <div class="my-3">
                If a tag format doesn't match any Helm chart you can safely
                delete it. Tag formats currently matching any Helm chart may not
                be deleted.
            </div>
        </div>

        <PlatzCollection :items="tagFormats">
            <template #item="scope">
                <PlatzItemWithActions>
                    <template #contents>
                        <div class="my-2">
                            <div class="my-1 text-success font-monospace">
                                {{ scope.item.pattern }}
                            </div>
                            <div class="small my-1 text-body-secondary">
                                Added
                                <PlatzMoment :value="scope.item.created_at" />
                            </div>
                        </div>
                    </template>
                    <template #actions>
                        <li>
                            <a
                                class="dropdown-item"
                                @click="
                                    deleteTagFormat &&
                                        deleteTagFormat.open(scope.item)
                                "
                            >
                                <FaIcon icon="trash" fixed-width />
                                Delete Tag Format
                            </a>
                        </li>
                    </template>
                </PlatzItemWithActions>
            </template>
        </PlatzCollection>

        <AddTagFormat ref="addTagFormat" />
        <DeleteTagFormat ref="deleteTagFormat" />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "@/store";
import PlatzMoment from "@/components/base/PlatzMoment.vue";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzItemWithActions from "@/components/collection/PlatzItemWithActions.vue";
import AddTagFormat from "./AddTagFormat.vue";
import DeleteTagFormat from "./DeleteTagFormat.vue";

export default defineComponent({
    components: {
        PlatzMoment,
        PlatzCollection,
        PlatzItemWithActions,
        AddTagFormat,
        DeleteTagFormat,
    },

    setup() {
        const addTagFormat = ref<typeof AddTagFormat>();
        const deleteTagFormat = ref<typeof DeleteTagFormat>();
        const store = useStore();

        const tagFormats = computed(
            () => store!.collections.helmTagFormats.all
        );

        return {
            tagFormats,
            addTagFormat,
            deleteTagFormat,
        };
    },
});
</script>
