import { ChatOpenRouter } from "@langchain/openrouter";
import { TavilySearch } from "@langchain/tavily";
import { createAgent } from "langchain";

const LLM = new ChatOpenRouter({
  model: process.env.AI_MODEL,
});

const TOOLS = [
  new TavilySearch({
    tavilyApiKey: process.env.TAVILY_API_KEY,
    maxResults: 5,
  }),
];

const PROMPT = `
Answer the following questions as best you can. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought:{agent_scratchpad}
`;

const ReActAgent = createAgent({
  model: LLM,
  systemPrompt: PROMPT,
  tools: TOOLS,
});

export function search(query: string) {
  return ReActAgent.invoke({
    messages: [
      {
        role: "human",
        content: query,
      },
    ],
  });
}
