import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { ChatOpenRouter } from "@langchain/openrouter";
import { SqliteSaver } from "@langchain/langgraph-checkpoint-sqlite";

import { createAgent, HumanMessage } from "langchain";
import { ChatState } from "./types";

type ChatStateShema = typeof ChatState.State;

const LLM = new ChatOpenRouter({
  model: process.env.AI_MODEL,
});

async function chat(graphState: ChatStateShema) {
  const agent = createAgent({
    model: LLM,
  });

  const result = await LLM.invoke(graphState.messages);

  return { messages: [result] };
}

const sqliteSaver = SqliteSaver.fromConnString("chatBot.db");

const graph = new StateGraph(ChatState)
  .addNode("chat", chat)
  .addEdge(START, "chat")
  .addEdge("chat", END)
  .compile({ checkpointer: sqliteSaver });

export async function invokeGraph(message: string, threadId: string) {
  while (true) {
    if (message === "exit") break;

    return await graph.invoke(
      { messages: [new HumanMessage(message)] },
      { configurable: { thread_id: threadId } },
    );
  }
}
