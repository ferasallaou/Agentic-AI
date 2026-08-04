import { END, START, StateGraph, StateSchema } from "@langchain/langgraph";
import { ChatOpenRouter } from "@langchain/openrouter";
import { PostEvaluationSchema, graphState, GraphStateSchema } from "./types";
import { HumanMessage, SystemMessage } from "langchain";

const LLM = new ChatOpenRouter({
  model: process.env.AI_MODEL,
});

const PostEvaluationLLM = LLM.withStructuredOutput(PostEvaluationSchema);

async function evaluate(state: GraphStateSchema) {
  const messages = [
    new SystemMessage(
      "You are a ruthless, no-laugh-given Facebook critic. You evaluate posts based on humor, originality, virality, and post format.",
    ),
    new HumanMessage(`
      Evaluate the following Facebook post:

Post: "${state.post}"

Use the criteria below to evaluate the post:

1. Originality – Is this fresh, or have you seen it a hundred times before?  
2. Humor – Did it genuinely make you smile, laugh, or chuckle?  
3. Punchiness – Is it short, sharp, and scroll-stopping?  
4. Virality Potential – Would people share, react, or comment on it?  
5. Format – Is it a well-formed Facebook post (not a setup-punchline joke, not a Q&A joke, and under 500 characters)?

Auto-reject if:
- It's written in question-answer format (e.g., "Why did..." or "What happens when...")
- It exceeds 500 characters
- It reads like a traditional setup-punchline joke
- Dont end with generic, throwaway, or deflating lines that weaken the humor (e.g., “Masterpieces of the auntie-uncle universe” or vague summaries)

### Respond ONLY in structured format:
- evaluation: "approved" or "needs_improvement"  
- feedback: One paragraph explaining the strengths and weaknesses 
      `),
  ];
  const output = await PostEvaluationLLM.invoke(messages);

  return {
    evaluation: output.evaluation,
    feedback: output.feedback,
    feedbackHistory: [output.feedback],
  };
}

async function optimize(state: GraphStateSchema) {
  const messages = [
    new SystemMessage(
      "You punch up Facebook posts for virality and humor based on given feedback.",
    ),
    new HumanMessage(`
Improve the Facebook post based on this feedback:
"${state.feedback}"

Original Post:
${state.post}

Re-write it as a short, viral-worthy Facebook post. Avoid Q&A style and stay under 500 characters.
`),
  ];

  const response = (await LLM.invoke(messages)).content;
  const iteration = state.iteration + 1;

  return { post: response, iteration: iteration, post_history: [response] };
}

const graph = new StateGraph(graphState)
  .addNode("evaluate", evaluate)
  .addNode("optimize", optimize)
  .addEdge(START, "evaluate")
  .addConditionalEdges(
    "evaluate",
    (state: GraphStateSchema) => {
      if (
        state.evaluation === "approved" ||
        state.iteration >= state.maxIteration
      )
        return "approved";
      else return "needs_improvment";
    },
    { approved: END, needs_improvment: "optimize" },
  )
  .addEdge("optimize", "evaluate")
  .compile();

export async function invokeGraph(post: string) {
  // Graph Mermaid
  // You can visualize it using Mermaid Viewer
  const drawableGraph = await graph.getGraphAsync();
  console.log(drawableGraph.drawMermaid());

  return await graph.invoke({ post, maxIteration: 3, iteration: 1 });
}
