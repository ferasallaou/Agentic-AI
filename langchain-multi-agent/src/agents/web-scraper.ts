import { ChatOpenRouter } from "@langchain/openrouter";
import { createAgent } from "langchain";
import { webScrapeTool } from "../tools/web-scraper";

export const LLM = new ChatOpenRouter({
  model: process.env.AI_MODEL,
  temperature: 0,
});

export const buildWebScraperAgent = createAgent({
  model: LLM,
  tools: [webScrapeTool],
});
