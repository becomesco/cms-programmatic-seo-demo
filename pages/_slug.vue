<template>
  <div class="programmaticPage">
    <div class="wrapper">
      <NuxtLink to="/" class="link">Home</NuxtLink>
    </div>
    <!-- Main Content -->
    <ContentManager :content="content" />
    <!-- Related Programmatic Pages -->
    <ProgrammaticRelated :data="{ items: related }" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { BCMSEntryContentParsedItem } from "@becomes/cms-client/types";
import ProgrammaticRelated from "~/components/widgets/ProgrammaticRelated.vue";

interface Data {
  title: string;
  content: BCMSEntryContentParsedItem[];
}

export default Vue.extend<Data, unknown, unknown>({
  name: "ProgrammaticPage",
  components: {
    ProgrammaticRelated,
  },
  async asyncData({ $bcms, params }) {
    const locale = "en";
    const slug = params.slug;

    const data: {
      type: string;
      content: BCMSEntryContentParsedItem[];
      related: Array<{
        title: string;
        subtitle: string;
        uri: string;
      }>;
      // $bcms.request handler is defined inside the `/api/programmatic`
    } = await $bcms.request({
      url: `/${locale}/programmatic/${slug}/data.json`,
      method: "get",
    });

    return {
      title: `CMS for ${data.type}`,
      content: data.content,
      related: data.related,
    };
  },
  head() {
    return {
      title: this.title,
    };
  },
});
</script>
