# Agentic AI

A small repo for testing agentic AI ideas with LangChain.

## Projects

- [langchain-single-agent](langchain-single-agent): a simple single-agent example. It uses LangChain, OpenRouter, and Tavily through LangChain’s built-in tool support.
- [langchain-multi-agent](langchain-multi-agent): a small multi-agent research flow. It splits work across agents for search, scraping, writing, and critique, and uses manually created tools instead of relying on Tavily’s LangChain tool.
- [langgraph-basic](langgraph-basic): a basic LangGraph example that demonstrates a graph-based workflow with LangGraph and OpenRouter.
- [langgraph-parallel-workflows](langgraph-parallel-workflows): a LangGraph example that runs multiple evaluation steps in parallel and combines their results.
- [langgraph-conditional-workflows](langgraph-conditional-workflows): a LangGraph example that routes the workflow based on the detected sentiment of a review.

## Quick start

- Single agent:
  - `cd langchain-single-agent`
  - `npm install`
  - `npm run dev`

- Multi-agent:
  - `cd langchain-multi-agent`
  - `npm install`
  - `npm run dev`

- LangGraph basic:
  - `cd langgraph-basic`
  - `npm install`
  - `npm run dev`

- Parallel workflows:
  - `cd langgraph-parallel-workflows`
  - `npm install`
  - `npm run dev`

- Conditional workflows:
  - `cd langgraph-conditional-workflows`
  - `npm install`
  - `npm run dev`

## Notes

The single-agent and multi-agent projects use Tavily and run as small Express APIs. The LangGraph example focuses on graph-based orchestration and mainly needs `AI_MODEL` configured.
