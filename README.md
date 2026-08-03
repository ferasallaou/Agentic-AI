# Agentic-AI

A small, work-in-progress repository for exploring agentic AI patterns with LangChain and related tools.

## Current project

### LangChain single agent

The current example lives in [langchain-single-agent](langchain-single-agent) and demonstrates a simple ReAct-style agent powered by:

- LangChain
- OpenRouter for the language model
- Tavily for web search
- Express for a lightweight API layer

### What it does

The app exposes a basic HTTP service with:

- GET / → health check endpoint
- POST /search → accepts a JSON body with a query string and returns the agent's final answer

### Main files

- [langchain-single-agent/src/agent.ts](langchain-single-agent/src/agent.ts) defines the agent, prompt template, and available tools
- [langchain-single-agent/src/index.ts](langchain-single-agent/src/index.ts) starts the Express server and wires the /search route

### Environment variables

Set these before running the project:

- AI_MODEL
- TAVILY_API_KEY
- PORT (optional, defaults to 3000)

### Run locally

```bash
cd langchain-single-agent
npm install
npm run dev
```

Then send a request like:

```bash
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{"query":"What is the latest news about AI agents?"}'
```

## Roadmap

This repository is still in progress. More projects will be added over time, including:

- LangGraph-based examples
- Multi-agent systems
- More advanced tool-use and orchestration patterns
