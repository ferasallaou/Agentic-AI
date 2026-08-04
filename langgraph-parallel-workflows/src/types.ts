import { Annotation, StateSchema } from "@langchain/langgraph";
import { z } from "zod";

export const graphState = Annotation.Root({
  essay: Annotation<string>(),
  languageFeedback: Annotation<string>(),
  analysisFeedback: Annotation<string>(),
  clarityFeedback: Annotation<string>(),
  overallFeedback: Annotation<string>(),
  individualScores: Annotation<number[]>({
    reducer: (a: number[], b: number[]) => [...a, ...b],
    default: () => [],
  }),
  avgScore: Annotation<number>(),
});

export type GraphStateSchema = typeof graphState.State;

export const EvaluationSchema = z.object({
  feedback: z.string().describe("Detailed feedback for the essay"),
  score: z.number().int().gt(0).lt(10).describe("Score out of 10"),
});
