import { ChatOpenRouter } from "@langchain/openrouter";
import { createAgent } from "langchain";
import { webSearchTool } from "../tools/web-search";
import { LLM } from "./web-scraper";

export const buildWebSearchAgent = createAgent({
  model: LLM,
  tools: [webSearchTool],
});
