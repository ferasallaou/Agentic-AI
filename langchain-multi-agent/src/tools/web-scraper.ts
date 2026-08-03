import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { tool } from "langchain";
import z from "zod";

async function scrapeURLS(urls: string[]) {
  const pages = [];
  for (let i = 0; i < urls.length; i++) {
    const loader = new CheerioWebBaseLoader(urls[i]);
    const loadPage = await loader.load();
    pages.push(loadPage);
  }

  return pages.flatMap((p) => p);
}

export const webScrapeTool = tool(
  async ({ urls }) => {
    return await scrapeURLS(urls);
  },
  {
    name: "web_scrapper",
    description: "Scrapes a bunch of Urls",
    schema: z.object({
      urls: z.array(z.string()).describe("Search Query"),
    }),
  },
);
