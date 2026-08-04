import { Annotation } from "@langchain/langgraph";
import { z } from "zod";

export const graphState = Annotation.Root({
  post: Annotation<string>(),
  evaluation: Annotation<"approved" | "needs_improvment">(),
  feedback: Annotation<string>(),
  iteration: Annotation<number>(),
  maxIteration: Annotation<number>(),
  postHistory: Annotation<string[]>({
    reducer: (a, b) => [...a, ...b],
    default: () => [],
  }),
  feedbackHistory: Annotation<string[]>({
    reducer: (a, b) => [...a, ...b],
    default: () => [],
  }),
});

export type GraphStateSchema = typeof graphState.State;

export const PostEvaluationSchema = z.object({
  evaluation: z
    .union([z.literal("approved"), z.literal("needs_improvment")])
    .describe("Final evaluation result."),
  feedback: z.string().describe("feedback for the Facebook post."),
});
