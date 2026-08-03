# Agentic AI

A small repo for testing agentic AI ideas with LangChain.

## Projects

- [langchain-single-agent](langchain-single-agent): a simple single-agent example. It uses LangChain, OpenRouter, and Tavily through LangChain’s built-in tool support.
- [langchain-multi-agent](langchain-multi-agent): a small multi-agent research flow. It splits work across agents for search, scraping, writing, and critique, and uses manually created tools instead of relying on Tavily’s LangChain tool.

## Quick start

- Single agent:
  - `cd langchain-single-agent`
  - `npm install`
  - `npm run dev`

- Multi-agent:
  - `cd langchain-multi-agent`
  - `npm install`
  - `npm run dev`

## Notes

Both projects need `AI_MODEL` and `TAVILY_API_KEY` set in their environment, and both run as small Express APIs.
