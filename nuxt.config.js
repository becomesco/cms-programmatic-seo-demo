import { createBcmsNuxtConfig, useBcmsMost } from "nuxt-plugin-bcms/module";
import { BCMSImageConfig } from "@becomes/cms-most/frontend";
import bcmsRoutes from "./bcms.routes";
import { entryToUrlWithCache } from "./util/server/entry-to-uri";

BCMSImageConfig.cmsOrigin =
  process.env.NUXT_ENV_BCMS_API_ORIGIN /* https://media.my-cms.com */;
BCMSImageConfig.localeImageProcessing = false;
BCMSImageConfig.publicApiKeyId =
  process.env.NUXT_ENV_BCMS_API_PUBLIC_KEY /* 62fe3...............a6f8 */;

export default {
  head: {
    script: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
    ],
  },
  target: "static",
  // Global page headers: https://go.nuxtjs.dev/config-head

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/styles/main.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      "nuxt-plugin-bcms",
      createBcmsNuxtConfig({
        cms: {
          origin: process.env.BCMS_API_ORIGIN /* https://cms.my-cms.com */,
          key: {
            id: process.env.BCMS_API_KEY /* 61cd7..............248b7 */,
            secret: process.env.BCMS_API_SECRET /* 5d46..............e01b9 */,
          },
        },
        websiteDomain: process.env.ORIGIN || "http://localhost:3000",
        media: {
          download: false,
        },
        server: {
          routes: bcmsRoutes,
          // domain: 'localhost',
          // port: 3000
        },
        entries: {
          async linkParser({ targetEntry, cache }) {
            return await entryToUrlWithCache(cache, targetEntry, "en", "");
          },
        },
      }),
    ],
  ],

  generate: {
    async routes() {
      const output = [];
      const most = useBcmsMost();
      /**
       * @type {import('./bcms/types').ProgrammaticEntry}
       */
      const programmatic = await most.content.entry.findOne(
        "programmatic",
        async () => true
      );
      programmatic.meta.en.columns[1].words.forEach((word) => {
        output.push(`/cms-for-${word.toLocaleLowerCase().replace(/ /g, "-")}`);
      });
      return output;
    },
    fallback: "404.html",
  },
};
