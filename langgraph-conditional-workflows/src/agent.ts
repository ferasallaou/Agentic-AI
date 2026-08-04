import { END, START, StateGraph, StateSchema } from "@langchain/langgraph";
import { ChatOpenRouter } from "@langchain/openrouter";
import {
  SentimentSchema,
  DiagnosisSchema,
  graphState,
  GraphStateSchema,
} from "./types";

const LLM = new ChatOpenRouter({
  model: process.env.AI_MODEL,
});

const sentimentLLM = LLM.withStructuredOutput(SentimentSchema);
const diagnosisLLM = LLM.withStructuredOutput(DiagnosisSchema);

async function discoverSentiment(state: GraphStateSchema) {
  const prompt = `What is the sentiment of the following review: ${state.review}`;
  const output = await sentimentLLM.invoke(prompt);

  return {
    sentiment: output.sentiment,
  };
}

async function diagnoseReview(state: GraphStateSchema) {
  const prompt = `What are the diagnosis of the following review: ${state.review}`;
  const output = await diagnosisLLM.invoke(prompt);

  return {
    diagnosis: output,
  };
}

async function positiveResponse(state: GraphStateSchema) {
  const prompt = `Write a warm thank you message in response to this review \n ${state.review}`;
  const llmResponse = await LLM.invoke(prompt);
  return {
    response: llmResponse.content,
  };
}
async function negativeResponse(state: GraphStateSchema) {
  const prompt = `You are a support assistant.
  The use has left this review: ${state.review} 
  The user had a ${state.diagnosis.issueType} issue, sounded ${state.diagnosis.tone}, and marked urgency as ${state.diagnosis.urgency}.
  Write a helpful empathic resoltion message 
  `;
  const llmResponse = await LLM.invoke(prompt);
  return {
    response: llmResponse.content,
  };
}

const graph = new StateGraph(graphState)
  .addNode("discoverSentiment", discoverSentiment)
  .addNode("diagnoseReview", diagnoseReview)
  .addNode("positiveResponse", positiveResponse)
  .addNode("negativeResponse", negativeResponse)
  .addEdge(START, "discoverSentiment")
  .addEdge("diagnoseReview", "negativeResponse")
  .addConditionalEdges("discoverSentiment", (state: GraphStateSchema) => {
    if (state.sentiment === "positive") return "positiveResponse";
    else return "diagnoseReview";
  })

  .addEdge("negativeResponse", END)
  .addEdge("positiveResponse", END)
  .compile();

export async function invokeGraph(review: string) {
  // Graph Mermaid
  // You can visualize it using Mermaid Viewer
  const drawableGraph = await graph.getGraphAsync();
  console.log(drawableGraph.drawMermaid());

  return await graph.invoke({ review });
}
