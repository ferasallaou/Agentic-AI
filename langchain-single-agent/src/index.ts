import express, { Express, Request, Response, NextFunction } from "express";
import { search } from "./agent";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: `UP & Running 🚀` });
});

app.post("/search", async (req: Request, res: Response) => {
  if (!req.body.query) {
    return res.status(400).json({ message: "field query is required" });
  }

  const results = await search(req.body.query);

  return res.status(200).json({ results: results.messages.at(-1)?.content });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong inside the server" });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
