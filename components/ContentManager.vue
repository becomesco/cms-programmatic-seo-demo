<template>
  <div class="content">
    <template v-for="(item, itemIdx) in content">
      <template v-if="item.type === 'widget'">
        <WidgetManager :key="itemIdx" :widget="item" />
      </template>
      <template v-else>
        <div
          :key="itemIdx"
          :class="`content--${item.type.toUpperCase()}${
            item.type === 'heading' ? '_' + item.attrs.level : ''
          } ${item.type === 'widget' ? `content--${item.name}_widget` : ''}`"
          v-html="item.value"
        />
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import {
  BCMSEntryContentParsedItem,
  BCMSPropType,
} from "@becomes/cms-client/types";
import Vue from "vue";
import type { PropType } from "vue";
import WidgetManager from "./widgets/Manager.vue";

export default Vue.extend({
  name: "BCMSContentManager",
  components: {
    WidgetManager,
  },
  props: {
    content: {
      type: Array as PropType<
        BCMSEntryContentParsedItem[] | BCMSEntryContentParsedItem[][]
      >,
      required: true,
    },
  },
  data() {
    return {
      BCMSPropType,
    } as any;
  },
});
</script>
