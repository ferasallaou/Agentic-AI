import { END, START, StateGraph, StateSchema } from "@langchain/langgraph";
import { ChatOpenRouter } from "@langchain/openrouter";
import { EvaluationSchema, graphState, GraphStateSchema } from "./types";

const LLM = new ChatOpenRouter({
  model: process.env.AI_MODEL,
});

const structuredLLM = LLM.withStructuredOutput(EvaluationSchema);

async function evaluateLanguage(state: GraphStateSchema) {
  const prompt = `Evaluate the language quality of the following essay and provide a feedback and assign a score out of 10 \n ${state["essay"]}`;
  const output = await structuredLLM.invoke(prompt);

  return {
    languageFeedback: output.feedback,
    individualScores: [...state.individualScores, output.score],
  };
}

async function evaluateAnalysis(state: GraphStateSchema) {
  const prompt = `Evaluate the depth of analysis of the following essay and provide a feedback and assign a score out of 10 \n ${state["essay"]}`;
  const output = await structuredLLM.invoke(prompt);

  return {
    analysisFeedback: output.feedback,
    individualScores: [...state.individualScores, output.score],
  };
}

async function evaluateThought(state: GraphStateSchema) {
  const prompt = `Evaluate the clarity of thought of the following essay and provide a feedback and assign a score out of 10 \n ${state["essay"]}`;
  const output = await structuredLLM.invoke(prompt);

  return {
    clarityFeedback: output.feedback,
    individualScores: [...state.individualScores, output.score],
  };
}

async function finalEvaluation(state: GraphStateSchema) {
  const prompt = `Based on the following feedbacks create a summarized feedback \n language feedback - ${state["languageFeedback"]} \n depth of analysis feedback - ${state["analysisFeedback"]} \n clarity of thought feedback - ${state["clarityFeedback"]}`;
  const output = await LLM.invoke(prompt);

  return {
    overallFeedback: output.content,
    avgScore:
      state.individualScores
        .flatMap((s) => s)
        .reduce((accumulator, current) => accumulator + current, 0) /
      state.individualScores.length,
  };
}

const graph = new StateGraph(graphState)
  .addNode("evaluateLanguage", evaluateLanguage)
  .addNode("evaluateAnalysis", evaluateAnalysis)
  .addNode("evaluateThought", evaluateThought)
  .addNode("finalEvaluation", finalEvaluation)
  .addEdge(START, "evaluateLanguage")
  .addEdge(START, "evaluateAnalysis")
  .addEdge(START, "evaluateThought")
  .addEdge("evaluateLanguage", "finalEvaluation")
  .addEdge("evaluateAnalysis", "finalEvaluation")
  .addEdge("evaluateThought", "finalEvaluation")
  .addEdge("finalEvaluation", END)
  .compile();

export async function invokeGraph(essay: string) {
  // Graph Mermaid
  // You can visualize it using Mermaid Viewer
  const drawableGraph = await graph.getGraphAsync();
  console.log(drawableGraph.drawMermaid());

  return await graph.invoke({ essay });
}
