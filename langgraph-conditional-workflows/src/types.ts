import { Annotation } from "@langchain/langgraph";
import { z } from "zod";

export const graphState = Annotation.Root({
  review: Annotation<string>(),
  sentiment: Annotation<"positive" | "negative">(),
  diagnosis: Annotation<Record<string, string>>(),
  response: Annotation<string>(),
});

export type GraphStateSchema = typeof graphState.State;

export const SentimentSchema = z.object({
  sentiment: z
    .union([z.literal("positive"), z.literal("negative")])
    .describe("Sentiment of a reivew"),
});

export const DiagnosisSchema = z.object({
  issueType: z
    .union([
      z.literal("UX"),
      z.literal("Bug"),
      z.literal("Performance"),
      z.literal("Support"),
      z.literal("Other"),
    ])
    .describe("The category of issue mentioned in the review"),
  tone: z
    .union([
      z.literal("angry"),
      z.literal("fraustrated"),
      z.literal("disappointed"),
      z.literal("calm"),
    ])
    .describe("The emotioanl tone expressed by the user"),
  urgency: z
    .union([z.literal("low"), z.literal("mediun"), z.literal("high")])
    .describe("How urgent or critical the issue appears to be"),
});
