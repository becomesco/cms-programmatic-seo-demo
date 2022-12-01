<template>
  <section class="programmaticTextWidget">
    <div class="wrapper">
      <div class="programmaticTextWidget--title">
        <ContentManager :content="data.title" />
      </div>
      <div class="programmaticTextWidget--description">
        <ContentManager :content="data.options[0]" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import type { PropType } from 'vue';
import { ProgrammaticTextWidget } from '~/bcms/types';

export default Vue.extend({
  name: 'ProgrammaticTextWidget',
  components: {
    ContentManager: () => import('../ContentManager.vue'),
  },
  props: {
    data: {
      type: Object as PropType<ProgrammaticTextWidget>,
      required: true,
    },
  },
});
</script>
