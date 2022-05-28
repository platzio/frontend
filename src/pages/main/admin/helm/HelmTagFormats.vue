<template>
  <div>
    <div class="mt-0 h4 fw-bold">Helm Tag Formats</div>

    <div class="my-4">
      <div class="my-3">
        The formats below are how Helm chart tags are parsed into version, revision, Git branch and
        commit.
      </div>

      <div class="my-3">
        You can add new tag formats, which triggers a parsing of all existing Helm charts. Tag
        format patterns are Perl-style regular expressions that may contain the following named
        groups:
        <strong>version</strong>, <strong>revision</strong>, <strong>branch</strong> and
        <strong>commit</strong>. If a named group is missing from the pattern, it will be stored as
        an empty string in case the rest of the pattern successfully matches the image tag.
      </div>

      <div class="my-3">
        When trying to parse a Helm tag, formats are tested by their creation time from newest to
        oldest. This means that if you add a new tag format it may potentially supersede existing
        tag formats.
      </div>

      <div class="my-3">
        If a tag format doesn't match any Helm chart you can safely delete it. Tag formats currently
        matching any Helm chart may not be deleted.
      </div>
    </div>

    <Collection :items="tagFormats">
      <template #item="scope">
        <CollectionItem>
          <div class="my-2 text-success font-monospace">
            {{ scope.item.pattern }}
          </div>
          <div class="small my-2">
            Matched <strong>{{ numMatches(scope.item.id) }}</strong> Helm charts
          </div>
          <div class="small my-2 text-muted">Added <Moment :value="scope.item.created_at" /></div>
        </CollectionItem>
      </template>
    </Collection>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { computed, defineComponent } from "vue";

export default defineComponent({
  setup() {
    const store = useStore();

    const tagFormats = computed(() => store!.collections.helmTagFormats.all);

    const numMatches = computed(
      () => (tagFormatId: string) =>
        store!.collections.helmCharts.all.filter((chart) => chart.tag_format_id === tagFormatId)
          .length
    );

    return {
      tagFormats,
      numMatches,
    };
  },
});
</script>
