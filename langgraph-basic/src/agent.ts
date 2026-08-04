import { END, START, StateGraph, StateSchema } from "@langchain/langgraph";
import { ChatOpenRouter } from "@langchain/openrouter";

import { createAgent, SystemMessage } from "langchain";
import z from "zod";

const graphState = new StateSchema({
  title: z.string(),
  outline: z.string(),
  post: z.string(),
});

type GraphStateSchema = typeof graphState.State;

const LLM = new ChatOpenRouter({
  model: process.env.AI_MODEL,
});

async function outLineAgent(graphState: GraphStateSchema) {
  const agent = createAgent({
    model: LLM,
  });

  const result = await agent.invoke({
    messages: [
      new SystemMessage(
        `Create a blog post outline for this topic: ${graphState.title}`,
      ),
    ],
  });

  return { outline: result.messages.at(-1)?.content };
}

async function blogPostAgent(graphState: GraphStateSchema) {
  const agent = createAgent({
    model: LLM,
  });

  const result = await agent.invoke({
    messages: [
      new SystemMessage(
        `Create a blog post for this topic: ${graphState.title} \n
        Following this outline ${graphState.outline}`,
      ),
    ],
  });

  return { post: result.messages.at(-1)?.content };
}

const graph = new StateGraph(graphState)
  .addNode("outLineAgent", outLineAgent)
  .addNode("blogPostAgent", blogPostAgent)
  .addEdge(START, "outLineAgent")
  .addEdge("outLineAgent", "blogPostAgent")
  .addEdge("blogPostAgent", END)
  .compile();

export async function invokeGraph(topic: string) {
  return await graph.invoke({ title: topic });
}
