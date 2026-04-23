import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import expenseRoutes from "./routes/expenseRoutes.js";

export function buildApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("combined"));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/expenses", expenseRoutes);

  return app;
}
