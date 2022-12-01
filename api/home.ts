import { createBcmsMostServerRoute } from "@becomes/cms-most";
import { BCMSMostServerRoutes } from "@becomes/cms-most/types";
import { HomeEntry } from "~/bcms/types";
import { Locale } from "~/types";

const homeDataExampleJSON = [
  {
    _id: "6317587ea871b0ac5ba946a3",
    createdAt: 1662474366256,
    updatedAt: 1668456485699,
    templateId: "63175619a871b0ac5ba9467f",
    templateName: "home",
    userId: "6203d6c9b84228703e0954b2",
    status: "",
    meta: {
      en: {
        title: "#1 Collaborative Headless CMS for agencies & their clients",
        slug: "home",
      },
    },
    content: {
      en: [],
    },
  },
];

export const homeApi: BCMSMostServerRoutes = {
  "/:locale/home.json": createBcmsMostServerRoute({
    method: "get",
    async handler({ bcms, params }) {
      const locale = params.locale as Locale;

      /* !!! Use commented code if you are using 'nuxt-plugin-bcms' plugin !!! */
      // const entry = (await bcms.content.entry.findOne(
      //   "home",
      //   async (e) => e.status !== "draft"
      // )) as unknown as HomeEntry;
      /* END */

      /* !!! Use this code for the testing purposes !!! */
      const entry = homeDataExampleJSON[0] as unknown as HomeEntry;
      /* END */

      if (!entry) {
        throw new Error("Home entry does not exists.");
      }

      return {
        title: entry.meta[locale].title,
      };
    },
  }),
};
