<template>
  <div class="homePage">
    <div class="wrapper">
      <!-- One of many programmatic pages ('blog' = dynamic part) -->
      <NuxtLink to="/cms-for-blog" class="link"> CMS for Blog </NuxtLink>

      <NuxtLink to="/cms-for-political-website" class="link">
        CMS for Political Website
      </NuxtLink>
      <NuxtLink to="/cms-for-news-website" class="link">
        CMS for News Website
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "HomePage",
  async asyncData({ $bcms }) {
    // $bcms.request handler is defined inside the `/api/home`
    const data = (await $bcms.request({
      url: "/en/home.json",
    })) as any;

    return data;
  },
  head() {
    return {
      title: this.title,
    };
  },
});
</script>
