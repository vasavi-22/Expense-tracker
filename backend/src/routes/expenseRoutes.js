import { Router } from "express";

import { createExpenseFromRequest, getExpensesFromQuery } from "../services/expenseService.js";

const expenseRoutes = Router();

expenseRoutes.post("/", (req, res) => {
  const idempotencyKey = req.get("Idempotency-Key")?.trim();
  const result = createExpenseFromRequest(req.body, idempotencyKey);
  return res.status(result.status).json(result.body);
});

expenseRoutes.get("/", (req, res) => {
  const result = getExpensesFromQuery(req.query);
  return res.status(result.status).json(result.body);
});

export default expenseRoutes;
