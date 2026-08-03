import { tavily } from "@tavily/core";
import { tool } from "langchain";
import z from "zod";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

async function webSearch(query: string) {
  const searchResults = await client.search(query, { maxResults: 10 });

  return searchResults.results.map((result) => ({
    title: result.title,
    url: result.url,
    content: result.content.slice(0, 500),
  }));
}

export const webSearchTool = tool(
  async ({ query }) => {
    return await webSearch(query);
  },
  {
    name: "web_search",
    description: "Search the web",
    schema: z.object({
      query: z.string().describe("Search Query"),
    }),
  },
);
