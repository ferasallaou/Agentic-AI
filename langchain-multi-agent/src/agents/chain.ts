import { ChatPromptTemplate } from "@langchain/core/prompts";
import { LLM } from "./web-scraper";
import { StringOutputParser } from "@langchain/core/output_parsers";

const writerPrompt = ChatPromptTemplate.fromMessages([
  {
    role: "system",
    content:
      "You are an expert research writer. Write clear, structured and insightful reports.",
  },
  {
    role: "human",
    content: `Write a detailed research report on the topic below.

Topic: {topic}

Research Gathered:
{research}

Structure the report as:
- Introduction
- Key Findings (minimum 3 well-explained points)
- Conclusion
- Sources (list all URLs found in the research)

Be detailed, factual and professional.`,
  },
]);

export const writerChain = writerPrompt
  .pipe(LLM)
  .pipe(new StringOutputParser());

const criticPrompt = ChatPromptTemplate.fromMessages([
  {
    role: "system",
    content:
      "You are a sharp and constructive research critic. Be honest and specific.",
  },
  {
    role: "human",
    content: `Review the research report below and evaluate it strictly.

Report:
{report}

Respond in this exact format:

Score: X/10

Strengths:
- ...
- ...

Areas to Improve:
- ...
- ...

One line verdict:
...`,
  },
]);

export const criticChain = criticPrompt
  .pipe(LLM)
  .pipe(new StringOutputParser());
