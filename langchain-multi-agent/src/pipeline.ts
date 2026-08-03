import { criticChain, writerChain } from "./agents/chain";
import { buildWebScraperAgent } from "./agents/web-scraper";
import { buildWebSearchAgent } from "./agents/web-search";

export async function createResearch(topic: string) {
  const state = new Map();

  const searchResults = await buildWebSearchAgent.invoke({
    messages: {
      role: "human",
      content: `Find recent, reliable and detailed information about ${topic}`,
    },
  });

  state.set(`searchResults`, searchResults.messages.at(-1)?.content);

  const webScraper = await buildWebScraperAgent.invoke({
    messages: [
      {
        role: "human",
        content: `
            Based on the following search results about ${topic}.
            pick the most relevant URL and scrape it deeeper.
            Search Results: ${state.get("searchResults")}
            `,
      },
    ],
  });

  state.set("scrapedContent", webScraper.messages.at(-1)?.content);

  const researchMaterial = `
  Search Results: ${state.get("searchResults")} \n
  Scraped Content: ${state.get("scrapedContent")}
  `;

  const writtenResearch = await writerChain.invoke({
    topic,
    research: researchMaterial,
  });

  state.set("report", writtenResearch);

  const feedback = await criticChain.invoke({
    report: writtenResearch,
  });

  state.set("feedback", feedback);

  return state;
}
