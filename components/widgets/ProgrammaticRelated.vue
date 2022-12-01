<template>
  <div class="programmaticRelatedWidget">
    <div class="wrapper">
      <div class="programmaticRelatedWidget--title">
        <h2><strong>Headless CMS</strong> is also suitable for:</h2>
      </div>
      <ul class="programmaticRelatedWidget--articles">
        <li
          v-for="(article, index) in data.items"
          :key="index"
          class="programmaticRelatedWidget--article"
        >
          <nuxt-link
            :to="article.uri"
            class="programmaticRelatedWidget--article-link"
          >
            <div class="programmaticRelatedWidget--article-label">
              {{ article.title }}
            </div>
            <h3 class="programmaticRelatedWidget--article-title">
              {{ article.subtitle }}
            </h3>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import type { PropType } from 'vue';

export default Vue.extend({
  name: 'ProgrammaticRelatedWidget',
  props: {
    data: {
      type: Object as PropType<{
        items: Array<{
          title: string;
          subtitle: string;
          uri: string;
        }>;
      }>,
      required: true,
    },
  },
});
</script>
