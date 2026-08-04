import express, { Express, Request, Response, NextFunction } from "express";
import { invokeGraph } from "./agent";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: `UP & Running 🚀` });
});

app.post("/evaluate", async (req: Request, res: Response) => {
  if (!req.body.essay) {
    return res.status(400).json({ message: "field essay is required" });
  }

  const results = await invokeGraph(req.body.essay);

  return res.status(200).json({ results });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong inside the server" });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
