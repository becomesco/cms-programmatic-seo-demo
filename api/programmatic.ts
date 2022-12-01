import { BCMSEntryContentParsedItem } from "@becomes/cms-client/types";
import { BCMSMostServerRoutes } from "@becomes/cms-most/types";
import { ProgrammaticEntry, ProgrammaticTextWidget } from "~/bcms/types";
import { Locale } from "~/types";
import { createBcmsMostServerRoute } from "@becomes/cms-most";
import { Seed } from "../scripts/util/seed";

const programmaticDataExampleJSON = [
  {
    _id: "6196152123117c002802438f",
    createdAt: 1660827068446,
    updatedAt: 1662461051898,
    templateId: "6196101123117c002802438a",
    templateName: "programmatic",
    userId: "608131f48990e6001ce20302",
    status: "",
    meta: {
      en: {
        title: "Programmatic",
        slug: "programmatic",
        columns: [
          {
            words: [
              "CMS",
              "CMS Software",
              "Content Editing System",
              "Content Management System",
              "Decoupled CMS",
              "Headless CMS",
              "Serverless CMS",
            ],
          },
          {
            words: [
              "Advertising Website",
              "Affiliate Website",
              "Biography Website",
              "Blog Website",
              "Blog",
              "Business Directory Website",
              "Business Website",
              "Catalogue Website",
              "Charity Website",
              "College Website",
              "Company Website",
              "Contact Page",
              "Corporate Website",
              "Directory Page",
              "E-commerce",
              "Educational Website",
              "Government Website",
              "Health Care Website",
              "High School Website",
              "Homepage",
              "Hosting Website",
              "Job Board",
              "Journalism Website",
              "Landing Page",
              "Lifestyle Website",
              "Livestreaming",
              "Magazine Website",
              "Marketplace",
              "Media Website",
              "Microsite",
              "Multilingual Website",
              "Music Website",
              "Networking Website",
              "News Website",
              "Non Profit Website",
              "One Page Website",
              "Personal Website",
              "Political Website",
              "Portfolio Website",
              "Portal Website",
              "Resume Website",
              "School Website",
              "Single Page Website",
              "Software Website",
              "Sport Website",
              "Startup Website",
              "Storage Website",
              "Streaming Website",
              "Tech Website",
              "Technology Website",
              "Travel Website",
              "Videogame Website",
              "Virtual Reality Website",
              "Web Portal",
              "Wiki Website",
              "Marketing Website",
              "NFT Website",
              "SaaS Website",
              "Mobile App",
              "Static Website",
            ],
          },
        ],
      },
    },
    content: {
      en: [
        {
          type: "widget",
          name: "programmatic_text",
          value: {
            title: [
              {
                type: "heading",
                attrs: {
                  level: 2,
                },
                value:
                  "<h2>Why should {{ type }} use a <u>{{ synonym }}</u>?</h2>",
              },
            ],
            description: [
              {
                type: "paragraph",
                value: "",
              },
            ],
            options: [
              [
                {
                  type: "paragraph",
                  value:
                    "<p>Spend more time creating content and scaling your {{ type }} and less time worrying about speed, security, and scalability.</p>",
                },
              ],
              [
                {
                  type: "paragraph",
                  value:
                    "<p>Instead of spending most of your time worrying about speed, security, and scalability, concentrate more on creating content and scaling your {{ type }}.</p>",
                },
              ],
              [
                {
                  type: "paragraph",
                  value:
                    "<p>The majority of your time should be spent on creating content for your {{ type }}, rather than worrying about speed, security, and scalability.</p>",
                },
              ],
            ],
          },
        },
      ],
    },
  },
];

function replaceTypeAndSynonym<T>(obj: T, type: string, synonym: string): T {
  return JSON.parse(
    JSON.stringify(obj)
      .replace(/{{ type }}/g, type)
      .replace(/{{ synonym }}/g, synonym)
  );
}

export const programmaticApi: BCMSMostServerRoutes = {
  "/:locale/programmatic/:slug/data.json": createBcmsMostServerRoute<{
    content: BCMSEntryContentParsedItem[];
    type: string;
    related: Array<{
      title: string;
      subtitle: string;
      uri: string;
    }>;
  }>({
    method: "get",
    async handler({ bcms, params }) {
      const locale = params.locale as Locale;
      const slug = params.slug;
      const slugParts = slug.split("-for-").map((e) => e.replace(/-/g, " "));

      if (slugParts.length !== 2) {
        throw new Error(`Invalid slug "${slug}"`);
      }

      const entry = JSON.parse(
        JSON.stringify(
          await bcms.content.entry.findOne(
            "programmatic",
            async (e) =>
              e.status !== "draft" && e.meta.en.slug === "programmatic"
          )
        )
      ) as ProgrammaticEntry;

      /* !!! Use this code for the testing purposes only if you don't have your ENV keys set up !!! */
      // const entry =
      //   programmaticDataExampleJSON[0] as unknown as ProgrammaticEntry;
      /* END */

      if (!entry) {
        throw new Error("Programmatic entry does not exists.");
      }

      const type = entry.meta[locale].columns
        ? entry.meta[locale].columns[1].words.find(
            (e) => e.toLowerCase().replace(/-/g, " ") === slugParts[1]
          )
        : "";

      if (!type) {
        throw new Error(`Missing type for "${slugParts[1]}"`);
      }

      const randomNumber = Seed(slug)();
      const synonym = entry.meta[locale].columns
        ? entry.meta[locale].columns[0].words[
            (randomNumber % (entry.meta[locale].columns[0].words.length - 1)) +
              1
          ]
        : "CMS";
      for (let i = 0; i < entry.content[locale].length; i++) {
        const content = entry.content[locale][i];
        if (content.name === "programmatic_text") {
          const data = content.value as unknown as ProgrammaticTextWidget;
          data.options = [data.options[randomNumber % data.options.length]];
        }
      }
      entry.content[locale] = replaceTypeAndSynonym(
        entry.content[locale],
        type,
        synonym
      );
      const related: Array<{
        title: string;
        subtitle: string;
        uri: string;
      }> = [];
      if (entry.meta[locale].columns) {
        const words = entry.meta[locale].columns[1].words;
        let atIndex = randomNumber % words.length;
        let count = 0;
        let loop = true;
        while (loop) {
          const word = words[atIndex];
          if (word !== type) {
            related.push({
              title: "CMS —",
              subtitle: `Headless CMS for ${word}`,
              uri: `cms-for-${word.toLowerCase().split(" ").join("-")}`,
            });
            count++;
            if (count === 6) {
              loop = false;
              break;
            }
          }
          atIndex++;
          if (atIndex === words.length) {
            atIndex = 0;
          }
        }
      }

      return {
        content: entry.content[locale],
        type,
        related,
      };
    },
  }),
};
