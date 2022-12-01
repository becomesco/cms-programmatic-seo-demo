<template>
  <div
    v-if="componentExists(widget.name)"
    :class="`content--WIDGET content--${widget.name}_widget`"
  >
    <component :is="toCamelCase(widget.name)" :data="widget.value" />
  </div>
  <div v-else :class="`content--WIDGET content--${widget.name}_widget`" />
</template>

<script lang="ts">
import {
  BCMSEntryContentParsedItem,
  BCMSPropType,
} from "@becomes/cms-client/types";
import Vue from "vue";
import type { PropType } from "vue";
// Import all widgets:
import ProgrammaticText from "./ProgrammaticText.vue";

const components = {
  // Map all widgets:
  ProgrammaticText,
};

export default Vue.extend({
  name: "BCMSWidgetManager",
  components,
  props: {
    widget: {
      type: Object as PropType<BCMSEntryContentParsedItem>,
      required: true,
    },
  },
  data() {
    return {
      BCMSPropType,
    };
  },
  methods: {
    componentExists(s: string): boolean {
      const name = this.toCamelCase(s);
      return !!components[name];
    },
    toCamelCase(s: string): string {
      return s
        .split("_")
        .map(
          (e) => e.substring(0, 1).toUpperCase() + e.substring(1).toLowerCase()
        )
        .join("");
    },
  },
});
</script>
